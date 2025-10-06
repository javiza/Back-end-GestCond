import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Casa } from './casa.entity';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class CasasService {
  constructor(
    @InjectRepository(Casa) private readonly repo: Repository<Casa>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
  ) {}

  async create(dto: CreateCasaDto) {
    const loc = await this.usuarios.findOne({ where: { id: dto.id_locatario, rol: 'locatario' as any } });
    if (!loc) {
      throw new NotFoundException('Locatario no encontrado o no es rol locatario');
    }
    const casa = this.repo.create({ direccion: dto.direccion, locatario: loc });
    return this.repo.save(casa);
  }

  findAll() {
    return this.repo.find({ relations: ['locatario'] });
  }

  async findOne(id: number) {
    const casa = await this.repo.findOne({ where: { id }, relations: ['locatario'] });
    if (!casa) {
      throw new NotFoundException('Casa no encontrada');
    }
    return casa;
  }

  async update(id: number, dto: UpdateCasaDto) {
    const casa = await this.findOne(id);
    if (dto.id_locatario) {
      const loc = await this.usuarios.findOne({ where: { id: dto.id_locatario, rol: 'locatario' as any } });
      if (!loc) {
        throw new NotFoundException('Locatario no encontrado o no es rol locatario');
      }
      casa.locatario = loc;
    }
    if (dto.direccion) {
      casa.direccion = dto.direccion;
    }
    return this.repo.save(casa);
  }

  async remove(id: number) {
    const casa = await this.findOne(id);
    await this.repo.remove(casa);
    return { deleted: true };
  }
}
