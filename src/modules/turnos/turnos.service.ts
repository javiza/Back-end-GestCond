import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno) private readonly repo: Repository<Turno>,
    @InjectRepository(PersonalInterno) private readonly personal: Repository<PersonalInterno>,
  ) {}

  async create(dto: CreateTurnoDto) {
    const p = await this.personal.findOne({ where: { id: dto.id_personal } });
    if (!p) {
      throw new NotFoundException('Personal no encontrado');
    }
    const t = this.repo.create({
      personal: p,
      fecha_inicio: new Date(dto.fecha_inicio),
      fecha_fin: new Date(dto.fecha_fin),
      tipo_turno: dto.tipo_turno
    });
    return this.repo.save(t);
  }

  findAll() { return this.repo.find({ relations: ['personal'] }); }

  async findOne(id: number) {
    const t = await this.repo.findOne({ where: { id }, relations: ['personal'] });
    if (!t) {
      throw new NotFoundException('Turno no encontrado');
    }
    return t;
  }

  

  async update(id: number, dto: UpdateTurnoDto) {
    const t = await this.findOne(id);
    if (dto.id_personal) {
      const p = await this.personal.findOne({ where: { id: dto.id_personal } });
      if (!p) {
        throw new NotFoundException('Personal no encontrado');
      }
      t.personal = p;
    }
    if (dto.fecha_inicio) {
      t.fecha_inicio = new Date(dto.fecha_inicio);
    }
    if (dto.fecha_fin) {
      t.fecha_fin = new Date(dto.fecha_fin);
    }
    if (dto.tipo_turno) {
      t.tipo_turno = dto.tipo_turno as any;
    }
    return this.repo.save(t);
  }

  async remove(id: number) {
    const t = await this.findOne(id);
    await this.repo.remove(t);
    return { deleted: true };
  }
}
