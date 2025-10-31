import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Topics } from '../../kafka/topics';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';

@Controller()
export class RegistrosConsumer {
  private readonly logger = new Logger(RegistrosConsumer.name);

  constructor(
    @InjectRepository(RegistroIngreso)
    private readonly repo: Repository<RegistroIngreso>,
  ) {}

  //  Evento: autorización validada desde Kafka
  @MessagePattern(Topics.AUTORIZACION_VALIDADA)
  async handleAutorizacionValidada(@Payload() message: any) {
    const data = message?.value ?? message;

    try {
      const entidad = this.repo.create({
        nombre: data.nombre,
        rut: data.rut,
        patente: data.patente,
        tipoVehiculo: data.tipo_vehiculo,   
        autorizadoPor: data.autorizado_por, 
        tipoVisita: data.tipo_visita,       
        fechaHoraIngreso: data.fecha_hora_ingreso
          ? new Date(data.fecha_hora_ingreso)
          : new Date(),
        guardia: { id: Number(data.id_guardia) },
        autorizacionQR: { id: Number(data.id_autorizacion_qr) },
      });

      const saved = await this.repo.save(entidad);
      this.logger.log(
        ` Ingreso registrado correctamente (id=${saved.id}) por evento AUTORIZACION_VALIDADA`,
      );

      // emitir un evento Kafka para analytics o Spark
      // this.kafka.emit(Topics.INGRESO_REGISTRADO, { id_registro: saved.id });
    } catch (e) {
      this.logger.error(` Error insertando registro: ${e?.message}`);
    }
  }

  // Evento: autorización rechazada
  @MessagePattern(Topics.AUTORIZACION_RECHAZADA)
  async handleAutorizacionRechazada(@Payload() message: any) {
    const data = message?.value ?? message;
    this.logger.warn(
      `QR rechazado: ${data.codigo_qr} — motivo: ${data.motivo}`,
    );
  }
}
