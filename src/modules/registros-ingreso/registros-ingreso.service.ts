import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { Guardia } from '../guardias/guardia.entity';

@Injectable()
export class RegistrosIngresosService {
  constructor(
    @InjectRepository(RegistroIngreso)
    private readonly repo: Repository<RegistroIngreso>,

    @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,
  ) {}

  // 📋 Listar todos los registros
  async findAll(): Promise<RegistroIngreso[]> {
    try {
      const registros = await this.repo.find({
        relations: ['autorizacionQR', 'guardia'],
        order: { fechaHoraIngreso: 'DESC' },
      });

      console.log(`📦 ${registros.length} registros cargados desde la base de datos`);
      return registros;
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

    if (!registro)
      throw new NotFoundException(`Registro con ID ${id} no encontrado.`);
    return registro;
  }

 async create(dto: CreateRegistroIngresoDto): Promise<RegistroIngreso> {
  try {
    if (!dto.id_guardia) {
      throw new BadRequestException('Debe indicar el guardia (usuario autenticado).');
    }

    const guardia = await this.guardiasRepo.findOne({
      where: { id: dto.id_guardia },
    });

    if (!guardia) {
      throw new BadRequestException('El guardia especificado no existe o no está asociado a un usuario válido.');
    }

    let rutLimpio: string | null = null;
    if (dto.rut && dto.rut.trim() !== '') {
      rutLimpio = dto.rut.replace(/\./g, '').replace(/[^0-9kK-]/g, '').trim().toUpperCase();
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
      guardia: { id: guardia.id } as any,
      autorizacionQR: dto.id_autorizacion_qr
        ? ({ id: dto.id_autorizacion_qr } as any)
        : null,
    });

    const guardado = await this.repo.save(nuevo);
    return guardado;
  } catch (error) {
    throw new InternalServerErrorException(error.message || 'Error al registrar el ingreso.');
  }
}

  // Actualizar registro existente
  async update(id: number, dto: UpdateRegistroIngresoDto): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    Object.assign(registro, dto);
    return this.repo.save(registro);
  }

  // Registrar salida
  async registrarSalida(id: number): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    registro.fechaHoraSalida = new Date();
    return this.repo.save(registro);
  }

  // 🗑️ Eliminar registro
  async remove(id: number): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    return this.repo.remove(registro);
  }
}
