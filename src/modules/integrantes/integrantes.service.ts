import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integrante } from './integrante.entity';
import { CreateIntegranteDto } from './dto/create-integrante.dto';
import { UpdateIntegranteDto } from './dto/update-integrante.dto';
import { Usuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';

@Injectable()
export class IntegrantesService {
  constructor(
    @InjectRepository(Integrante) private readonly repo: Repository<Integrante>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
    @InjectRepository(Casa) private readonly casas: Repository<Casa>,
  ) {}

  async create(dto: CreateIntegranteDto) {
    const loc = await this.usuarios.findOne({ where: { id: dto.id_locatario, rol: 'locatario' as any } });
    if (!loc) {
      throw new NotFoundException('Locatario no encontrado');
    }

    const casa = await this.casas.findOne({ where: { id: dto.id_casa } });
    if (!casa) {
      throw new NotFoundException('Casa no encontrada');
    }

    const integ = this.repo.create({ nombre: dto.nombre, parentesco: dto.parentesco, locatario: loc, casa });
    return this.repo.save(integ);
  }

  findAll() {
    return this.repo.find({ relations: ['locatario','casa','vehiculos'] });
  }

  async findOne(id: number) {
    const i = await this.repo.findOne({ where: { id }, relations: ['locatario','casa','vehiculos'] });
    if (!i) {
      throw new NotFoundException('Integrante no encontrado');
    }
    return i;
  }

  async update(id: number, dto: UpdateIntegranteDto) {
    const i = await this.findOne(id);
    if (dto.id_locatario) {
      const loc = await this.usuarios.findOne({ where: { id: dto.id_locatario, rol: 'locatario' as any } });
      if (!loc) {
        throw new NotFoundException('Locatario no encontrado');
      }
      i.locatario = loc;
    }
    if (dto.id_casa) {
      const casa = await this.casas.findOne({ where: { id: dto.id_casa } });
      if (!casa) {
        throw new NotFoundException('Casa no encontrada');
      }
      i.casa = casa;
    }
    if (dto.nombre) {
      i.nombre = dto.nombre;
    }
    if (dto.parentesco) {
      i.parentesco = dto.parentesco;
    }
    return this.repo.save(i);
  }

  async remove(id: number) {
    const i = await this.findOne(id);
    await this.repo.remove(i);
    return { deleted: true };
  }
}
