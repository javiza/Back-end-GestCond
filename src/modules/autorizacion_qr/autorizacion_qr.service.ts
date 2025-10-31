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

    const entity = this.repo.create({
      codigo_qr: dto.codigo_qr,
      motivo: dto.motivo ?? null,
      usuario: usuario ?? null,
    });

    const saved = await this.repo.save(entity);

    // Emitir evento Kafka
    this.kafka.emit(Topics.AUTORIZACION_CREADA, {
      id_autorizacion: saved.id,
      codigo_qr: saved.codigo_qr,
      motivo: saved.motivo,
      id_usuario: usuario?.id ?? null,
      fecha_hora: saved.fecha_hora,
    });

    this.logger.log(`AUTORIZACION_CREADA → ${saved.codigo_qr}`);

    return saved;
  }

  
  //  Validar un código QR escaneado por un guardia
  //  Si es válido : emite AUTORIZACION_VALIDADA
  //   Si no existe : emite AUTORIZACION_RECHAZADA

  async validarQR(dto: ValidarQRDto) {
    const autorizacion = await this.repo.findOne({
      where: { codigo_qr: dto.codigo_qr },
      relations: ['usuario'],
    });

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

    this.kafka.emit(Topics.AUTORIZACION_VALIDADA, {
      id_autorizacion_qr: autorizacion.id,
      codigo_qr: autorizacion.codigo_qr,
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
      message: 'Autorización válida. Evento emitido a Kafka.',
      autorizacion_id: autorizacion.id,
    };
  }
}
