import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoAutorizado } from './no-autorizado.entity';
import { CreateNoAutorizadoDto } from './dto/create-no-autorizado.dto';
import { UpdateNoAutorizadoDto } from './dto/update-no-autorizado.dto';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class NoAutorizadosService {
  constructor(
    @InjectRepository(NoAutorizado) private readonly repo: Repository<NoAutorizado>,
    @InjectRepository(Casa) private readonly casas: Repository<Casa>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
  ) {}

 async create(dto: CreateNoAutorizadoDto) {
    // Verificar guardia
    const guardia = await this.usuarios.findOne({
      where: { id: dto.id_guardia, rol: 'guardia' as any },
    });
    if (!guardia) {
      throw new NotFoundException('Guardia no encontrado');
    }

    // Verificar casa (solo si se envía)
    const casa = dto.id_casa
      ? await this.casas.findOne({ where: { id: dto.id_casa } })
      : undefined;

    if (dto.id_casa && !casa) {
      throw new NotFoundException('Casa no encontrada');
    }

    // Crear el registro
    const reg = this.repo.create({
      nombre: dto.nombre,
      rut: dto.rut,
      motivo: dto.motivo,
      casa: casa ?? undefined,
      guardia,
    });

    return this.repo.save(reg);
  }

  findAll() {
    return this.repo.find({ relations: ['casa', 'guardia'] });
  }

  async findOne(id: number) {
    const r = await this.repo.findOne({
      where: { id },
      relations: ['casa', 'guardia'],
    });
    if (!r) {
      throw new NotFoundException('Registro no encontrado');
    }
    return r;
  }

  async update(id: number, dto: UpdateNoAutorizadoDto) {
    const r = await this.findOne(id);

    if (dto.id_casa !== undefined) {
      if (dto.id_casa === null) {
        r.casa = undefined;
      } else {
        const casa = await this.casas.findOne({ where: { id: dto.id_casa } });
        if (!casa) {
          throw new NotFoundException('Casa no encontrada');
        }
        r.casa = casa;
      }
    }

    if (dto.nombre) {
      r.nombre = dto.nombre;
    }
    if (dto.rut) {
      r.rut = dto.rut;
    }
    if (dto.motivo) {
      r.motivo = dto.motivo;
    }

    return this.repo.save(r);
  }

  async remove(id: number) {
    const r = await this.findOne(id);
    await this.repo.remove(r);
    return { deleted: true };
  }

}
