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

  // Evento: autorización validada desde Kafka
  @MessagePattern(Topics.AUTORIZACION_VALIDADA)
  async handleAutorizacionValidada(@Payload() message: any) {
    const data = message?.value ?? message;

    try {
      const entidad = this.repo.create({
        nombre: data.nombre?.trim() || null,
        rut: data.rut
          ? data.rut.replace(/\./g, '').replace(/[^0-9kK-]/g, '').toUpperCase()
          : null,
        patente: data.patente?.trim() || null,
        tipoVehiculo: data.tipo_vehiculo?.trim() || null,
        autorizadoPor: data.autorizado_por?.trim() || 'Desconocido',
        lugarDestino: data.lugar_destino?.trim() || 'No especificado',
        tipoVisita: data.tipo_visita || 'visita',
        fechaHoraIngreso: data.fecha_hora_ingreso
          ? new Date(data.fecha_hora_ingreso)
          : new Date(),

        // FK hacia guardias (tu tabla usa id_guardia)
        guardia: { id: Number(data.id_guardia) || 1 } as any,

        // Asociación con autorización QR (si aplica)
        autorizacionQR: data.id_autorizacion_qr
          ? ({ id: Number(data.id_autorizacion_qr) } as any)
          : null,
      });

      const saved = await this.repo.save(entidad);

      this.logger.log(
        `Ingreso registrado correctamente (id=${saved.id}) por evento AUTORIZACION_VALIDADA (guardia_id=${data.id_guardia || 'N/A'})`,
      );

      // this.kafka.emit(Topics.INGRESO_REGISTRADO, { id_registro: saved.id });
    } catch (e) {
      this.logger.error(`Error insertando registro: ${e?.message}`);
    }
  }

  // Evento: autorización rechazada
  @MessagePattern(Topics.AUTORIZACION_RECHAZADA)
  async handleAutorizacionRechazada(@Payload() message: any) {
    const data = message?.value ?? message;
    this.logger.warn(
      `QR rechazado: ${data.codigo_qr} — motivo: ${data.motivo || 'No especificado'}`,
    );
  }
}
