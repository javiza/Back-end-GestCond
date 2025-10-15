import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculosRepo: Repository<Vehiculo>,
  ) {}

  async create(dto: CreateVehiculoDto): Promise<Vehiculo> {
    try {
      const nuevo = this.vehiculosRepo.create({
        patente: dto.patente,
        marca: dto.marca,
        modelo: dto.modelo,
        color: dto.color,
        tipo_vehiculo: dto.tipo_vehiculo as 'auto' | 'moto',
        tipo_propietario: dto.tipo_propietario as 'locatario' | 'integrante',
        casa: { id: dto.id_casa } as any,
        locatario: { id: dto.id_locatario } as any,
        integrante: dto.id_integrante ? ({ id: dto.id_integrante } as any) : null,
      });
      return await this.vehiculosRepo.save(nuevo);
    } catch (e) {
      if (e.code === '23505') throw new ConflictException('Patente ya registrada');
      throw e;
    }
  }

  async findAll(): Promise<Vehiculo[]> {
    return this.vehiculosRepo.find({
      relations: ['casa', 'locatario', 'integrante'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Vehiculo> {
    const v = await this.vehiculosRepo.findOne({
      where: { id },
      relations: ['casa', 'locatario', 'integrante'],
    });
    if (!v) throw new NotFoundException('Vehículo no encontrado');
    return v;
  }

  async update(id: number, dto: UpdateVehiculoDto): Promise<Vehiculo> {
    const v = await this.findOne(id);
    Object.assign(v, dto);
    if (dto.id_casa) v.casa = { id: dto.id_casa } as any;
    if (dto.id_locatario) v.locatario = { id: dto.id_locatario } as any;
    if (dto.id_integrante) v.integrante = { id: dto.id_integrante } as any;
    return this.vehiculosRepo.save(v);
  }

  async remove(id: number): Promise<void> {
    const v = await this.findOne(id);
    await this.vehiculosRepo.remove(v);
  }
}
