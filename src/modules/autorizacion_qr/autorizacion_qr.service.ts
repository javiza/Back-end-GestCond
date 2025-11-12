import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientKafka } from '@nestjs/microservices';
import { AutorizacionQR } from './autorizacion_qr.entity';
import { CrearAutorizacionDto } from './dto/create-autorizacion_qr.dto';
import { ValidarQRDto } from './dto/validar-qr.dto';
import { Usuario } from '../usuarios/usuarios.entity';
import { Topics } from '../../kafka/topics';


@Injectable()
export class AutorizacionQRService {
  private readonly logger = new Logger(AutorizacionQRService.name);

  constructor(
    @InjectRepository(AutorizacionQR)
    private readonly repo: Repository<AutorizacionQR>,

    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,

    @Inject('KAFKA_SERVICE')
    private readonly kafka: ClientKafka,
  ) {}

  //  Crear una nueva autorización QR
  //  Emite un evento Kafka: AUTORIZACION_CREADA

 async crear(dto: CrearAutorizacionDto) {
  const usuario = dto.id_usuario
    ? await this.usuariosRepo.findOne({ where: { id: dto.id_usuario } })
    : null;

  //  Agrego el campo faltante nombre_visita
  const entity = this.repo.create({
    codigo_qr: dto.codigo_qr,
    nombre_visita: dto.nombre_visita, // importante
    motivo: dto.motivo ?? null,
    usuario: usuario ?? null,
  });

  const saved = await this.repo.save(entity);

  // Emite el evento Kafka incluyendo nombre_visita
  this.kafka.emit(Topics.AUTORIZACION_CREADA, {
    id_autorizacion: saved.id,
    codigo_qr: saved.codigo_qr,
    nombre_visita: saved.nombre_visita, // agregarlo al evento
    motivo: saved.motivo,
    id_usuario: usuario?.id ?? null,
    fecha_hora: saved.fecha_hora,
  });

  this.logger.log(`AUTORIZACION_CREADA → ${saved.codigo_qr}`);

  return saved;
}
// Obtener todas las visitas registradas (todas las autorizaciones QR)
async findAll(): Promise<AutorizacionQR[]> {
  return this.repo.find({
    relations: ['usuario'],
    order: { fecha_hora: 'DESC' },
  });
}

// Obtener todas las visitas registradas por un usuario específico
async findByUsuario(id_usuario: number): Promise<AutorizacionQR[]> {
  const usuario = await this.usuariosRepo.findOne({ where: { id: id_usuario } });

  if (!usuario) {
    throw new NotFoundException(`No se encontró el usuario con ID ${id_usuario}`);
  }

  return this.repo.find({
    where: { usuario: { id: id_usuario } },
    relations: ['usuario'],
    order: { fecha_hora: 'DESC' },
  });
}

  
  //  Validar un código QR escaneado por un guardia
  //  Si es válido : emite AUTORIZACION_VALIDADA
  //   Si no existe : emite AUTORIZACION_RECHAZADA

 async validarQR(dto: ValidarQRDto) {
  const autorizacion = await this.repo.findOne({
    where: { codigo_qr: dto.codigo_qr },
    relations: ['usuario'],
  });

  //  No existe
  if (!autorizacion) {
    this.kafka.emit(Topics.AUTORIZACION_RECHAZADA, {
      codigo_qr: dto.codigo_qr,
      motivo: 'Código QR inexistente o expirado',
      fecha_hora: new Date().toISOString(),
      id_guardia: dto.id_guardia,
    });

    this.logger.warn(`AUTORIZACION_RECHAZADA → ${dto.codigo_qr}`);
    throw new NotFoundException('Código QR inválido o inexistente');
  }

  // Ya fue usado anteriormente
  if (autorizacion.usado) {
    this.kafka.emit(Topics.AUTORIZACION_RECHAZADA, {
      codigo_qr: dto.codigo_qr,
      motivo: 'El código QR ya fue utilizado previamente',
      fecha_hora: new Date().toISOString(),
      id_guardia: dto.id_guardia,
    });

    this.logger.warn(`AUTORIZACION_RECHAZADA (reuso) → ${dto.codigo_qr}`);
    throw new NotFoundException('El código QR ya fue utilizado.');
  }

  // Código válido — se marca como usado
  autorizacion.usado = true;
  await this.repo.save(autorizacion);

  // Emitir evento Kafka
  this.kafka.emit(Topics.AUTORIZACION_VALIDADA, {
    id_autorizacion_qr: autorizacion.id,
    codigo_qr: autorizacion.codigo_qr,
    nombre_visita: autorizacion.nombre_visita,
    tipo_visita: dto.tipo_visita,
    nombre: dto.nombre,
    rut: dto.rut ?? null,
    patente: dto.patente ?? null,
    tipo_vehiculo: dto.tipo_vehiculo ?? null,
    autorizado_por: autorizacion.usuario?.nombre ?? 'N/D',
    id_guardia: dto.id_guardia,
    fecha_hora_ingreso: new Date().toISOString(),
  });

  this.logger.log(`AUTORIZACION_VALIDADA → ${autorizacion.codigo_qr}`);

 return {
  ok: true,
  message: 'Autorización válida. Código QR marcado como usado.',
  autorizacion_id: autorizacion.id,
  codigo_qr: autorizacion.codigo_qr,
  nombre_visita: autorizacion.nombre_visita,
  motivo: autorizacion.motivo,
  fecha_hora: autorizacion.fecha_hora,
};

}

}
