import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Integrante } from '../integrantes/integrante.entity';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo) private readonly repo: Repository<Vehiculo>,
    @InjectRepository(Casa) private readonly casas: Repository<Casa>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Integrante) private readonly integrantes: Repository<Integrante>,
  ) {}

  async create(dto: CreateVehiculoDto) {
    const casa = await this.casas.findOne({ where: { id: dto.id_casa } });
    if (!casa) {
      throw new NotFoundException('Casa no encontrada');
    }

    const loc = await this.usuarios.findOne({ where: { id: dto.id_locatario, rol: 'locatario' as any } });
    if (!loc) {
      throw new NotFoundException('Locatario no encontrado');
    }
const integrante =
  dto.id_integrante
    ? (await this.integrantes.findOne({
        where: { id: dto.id_integrante, casa: { id: casa.id } as any },
      })) ?? undefined
    : undefined;

if (dto.id_integrante && !integrante) {
  throw new NotFoundException('Integrante no encontrado en la casa indicada');
}


    const veh = this.repo.create({
      patente: dto.patente,
      marca: dto.marca,
      modelo: dto.modelo,
      color: dto.color,
      tipo_propietario: dto.tipo_propietario ?? 'locatario',
      casa, locatario: loc, integrante
    });
    return this.repo.save(veh);
  }

  findAll() {
    return this.repo.find({ relations: ['casa', 'locatario', 'integrante'] });
  }

  async findOne(id: number) {
    const v = await this.repo.findOne({ where: { id }, relations: ['casa','locatario','integrante'] });
    if (!v) {
      throw new NotFoundException('Vehículo no encontrado');
    }
    return v;
  }

  async update(id: number, dto: UpdateVehiculoDto) {
    const v = await this.findOne(id);
    if (dto.id_casa) {
      const casa = await this.casas.findOne({ where: { id: dto.id_casa } });
      if (!casa) {
        throw new NotFoundException('Casa no encontrada');
      }
      v.casa = casa;
    }
    if (dto.id_locatario) {
      const loc = await this.usuarios.findOne({ where: { id: dto.id_locatario, rol: 'locatario' as any } });
      if (!loc) {
        throw new NotFoundException('Locatario no encontrado');
      }
      v.locatario = loc;
    }
    if (dto.id_integrante !== undefined) {
      if (dto.id_integrante === null as any) {
        v.integrante = undefined;
      } else {
        const integ = await this.integrantes.findOne({ where: { id: dto.id_integrante } });
        if (!integ) {
          throw new NotFoundException('Integrante no encontrado');
        }
        v.integrante = integ;
      }
    }
    Object.assign(v, {
      patente: dto.patente ?? v.patente,
      marca: dto.marca ?? v.marca,
      modelo: dto.modelo ?? v.modelo,
      color: dto.color ?? v.color,
      tipo_propietario: dto.tipo_propietario ?? v.tipo_propietario,
    });
    return this.repo.save(v);
  }

  async remove(id: number) {
    const v = await this.findOne(id);
    await this.repo.remove(v);
    return { deleted: true };
  }
}
