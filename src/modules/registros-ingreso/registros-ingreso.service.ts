import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { Guardia } from '../guardias/guardia.entity';
import { Turno } from '../turnos/turno.entity';

@Injectable()
export class RegistrosIngresosService {
  constructor(
    @InjectRepository(RegistroIngreso)
    private readonly repo: Repository<RegistroIngreso>,

    @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,

    @InjectRepository(Turno)
    private readonly turnosRepo: Repository<Turno>,
  ) {}

  // 📋 Listar todos los registros
  async findAll(): Promise<RegistroIngreso[]> {
    try {
      return await this.repo.find({
        relations: ['autorizacionQR', 'guardia'],
        order: { fechaHoraIngreso: 'DESC' },
      });
    } catch (error) {
      console.error('❌ Error al obtener registros:', error);
      throw new InternalServerErrorException('Error al obtener los registros de ingreso.');
    }
  }

  // 🔎 Buscar un registro por ID
  async findOne(id: number): Promise<RegistroIngreso> {
    const registro = await this.repo.findOne({
      where: { id },
      relations: ['autorizacionQR', 'guardia'],
    });

    if (!registro) throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    return registro;
  }

  // ✅ Crear registro usando el guardia del turno activo
  async create(dto: CreateRegistroIngresoDto): Promise<RegistroIngreso> {
    try {
      // Buscar turno activo (sin observacion_termino)
      const turnoActivo = await this.turnosRepo.findOne({
        where: { observacion_termino: IsNull() },
        relations: ['guardia'],
        order: { fecha_hora_inicio: 'DESC' },
      });

      if (!turnoActivo || !turnoActivo.guardia) {
        throw new BadRequestException(
          'No hay un turno activo. Un guardia debe iniciar un turno antes de registrar ingresos.'
        );
      }

      const guardia = turnoActivo.guardia;

      // Limpieza y validación de RUT
      let rutLimpio: string | null = null;
      if (dto.rut && dto.rut.trim() !== '') {
        rutLimpio = dto.rut.replace(/\./g, '').replace(/[^0-9kK-]/g, '').trim().toUpperCase();
        if (!/^[0-9]{7,8}-[0-9K]$/.test(rutLimpio)) rutLimpio = null;
      }

      // Crear registro
      const nuevo = this.repo.create({
        nombre: dto.nombre?.trim() || null,
        rut: rutLimpio,
        patente: dto.patente?.trim() || null,
        tipoVehiculo: dto.tipo_vehiculo?.trim() || null,
        autorizadoPor: dto.autorizado_por.trim(),
        lugarDestino: dto.lugar_destino.trim(),
        tipoVisita: dto.tipo_visita,
        guardia: guardia, // 👈 Se asigna automáticamente el guardia del turno activo
        autorizacionQR: dto.id_autorizacion_qr
          ? ({ id: dto.id_autorizacion_qr } as any)
          : null,
      });

      const guardado = await this.repo.save(nuevo);
      const registro = await this.repo.findOne({
        where: { id: guardado.id },
        relations: ['guardia', 'autorizacionQR'],
      });

      if (!registro) {
        throw new NotFoundException('Error al obtener el registro recién creado.');
      }

      return registro;
    } catch (error) {
      console.error('❌ Error al registrar ingreso:', error);
      throw new InternalServerErrorException(error.message || 'Error al registrar el ingreso.');
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
    return this.repo.save(registro);
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
    console.error(' Error al listar todas las visitas:', error);
    throw new InternalServerErrorException('Error al listar todas las visitas registradas.');
  }
}
}