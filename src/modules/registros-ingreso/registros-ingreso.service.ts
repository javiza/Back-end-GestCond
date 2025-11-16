import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { Guardia } from '../guardias/guardia.entity';
import { Turno } from '../turnos/turno.entity';
import { RegistrosGateway } from './registros.gateway';

@Injectable()
export class RegistrosIngresosService implements OnModuleInit {
  constructor(
    @InjectRepository(RegistroIngreso)
    private readonly repo: Repository<RegistroIngreso>,

    @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,

    @InjectRepository(Turno)
    private readonly turnosRepo: Repository<Turno>,

    private readonly gateway: RegistrosGateway, 
  ) {}

  onModuleInit() {
    setInterval(() => {
      this.verificarDeliveriesPendientes();
    }, 60000);
  }

  async verificarDeliveriesPendientes() {
    const registros = await this.repo.find({
      where: { tipoVisita: 'delivery', alertaDelivery: false, fechaHoraSalida: IsNull() }
    });

    for (const r of registros) {
      const minutos = (Date.now() - new Date(r.fechaHoraIngreso).getTime()) / 1000 / 60;
      if (minutos >= 20) {
        r.alertaDelivery = true;
        await this.repo.save(r);
        this.gateway.emitirAlertaDelivery(r);
      }
    }
  }

  async findAll(): Promise<RegistroIngreso[]> {
    try {
      return await this.repo.find({
        relations: ['autorizacionQR', 'guardia'],
        order: { fechaHoraIngreso: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los registros de ingreso.');
    }
  }

  async findOne(id: number): Promise<RegistroIngreso> {
    const registro = await this.repo.findOne({
      where: { id },
      relations: ['autorizacionQR', 'guardia'],
    });

    if (!registro) throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    return registro;
  }

  async create(dto: CreateRegistroIngresoDto): Promise<RegistroIngreso> {
    try {
      const turnoActivo = await this.turnosRepo.findOne({
        where: { observacion_termino: IsNull() },
        relations: ['guardia'],
        order: { fecha_hora_inicio: 'DESC' },
      });

      if (!turnoActivo || !turnoActivo.guardia) {
        throw new BadRequestException('No hay un turno activo para registrar ingresos.');
      }

      const { guardia } = turnoActivo;

      const fechaChile = new Date(
        new Date().toLocaleString('sv-SE', { timeZone: 'America/Santiago' }).replace(' ', 'T')
      );

      let rutLimpio: string | null = null;
      if (dto.rut) {
        rutLimpio = dto.rut.replace(/\./g, '').replace(/[^0-9kK-]/g, '').toUpperCase();
        if (!/^[0-9]{7,8}-[0-9K]$/.test(rutLimpio)) rutLimpio = null;
      }

      const nuevo = this.repo.create({
        nombre: dto.nombre?.trim() || null,
        rut: rutLimpio,
        patente: dto.patente?.trim() || null,
        tipoVehiculo: dto.tipo_vehiculo?.trim() || null,
        autorizadoPor: dto.autorizado_por.trim(),
        lugarDestino: dto.lugar_destino.trim(),
        tipoVisita: dto.tipo_visita,
        fechaHoraIngreso: fechaChile,
        alertaDelivery: false,
        alertaLeida: false,
        guardia,
        autorizacionQR: dto.id_autorizacion_qr ? ({ id: dto.id_autorizacion_qr } as any) : null,
      });

      const guardado = await this.repo.save(nuevo);

      const registro = await this.repo.findOne({
        where: { id: guardado.id },
        relations: ['guardia', 'autorizacionQR'],
      });

      if (!registro) throw new NotFoundException('No se pudo recuperar el registro recién creado');

      this.gateway.emitirNuevoRegistro(registro);

      return registro;

    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, dto: UpdateRegistroIngresoDto): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    Object.assign(registro, dto);
    return this.repo.save(registro);
  }

  async registrarSalida(id: number): Promise<RegistroIngreso> {
  const registro = await this.findOne(id);

  registro.fechaHoraSalida = new Date();
  const guardado = await this.repo.save(registro);

  //  Enviar actualización a front para detener el cronómetro
  this.gateway.emitirAlertaDelivery(guardado);

  return guardado;
}


  async remove(id: number): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    return this.repo.remove(registro);
  }

  async listarTodasVisitas(): Promise<RegistroIngreso[]> {
    try {
      return await this.repo.find({
        relations: ['guardia', 'autorizacionQR'],
        order: { fechaHoraIngreso: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al listar todas las visitas registradas.');
    }
  }

  async marcarAlertaLeida(id: number) {
    const registro = await this.findOne(id);
    registro.alertaLeida = true;
    return this.repo.save(registro);
  }

  async obtenerDeliveriesLargos(): Promise<RegistroIngreso[]> {
    return this.repo.query(`
      SELECT *
      FROM registros_ingreso
      WHERE tipo_visita = 'delivery'
        AND alerta_delivery = true
        AND alerta_leida = false
      ORDER BY fecha_hora_ingreso DESC;
    `);
  }
}
