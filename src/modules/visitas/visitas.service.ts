import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visita } from './visita.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';

@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita)
    private readonly repo: Repository<Visita>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['casa', 'autorizadoPor'],
      order: { fecha_autorizacion: 'DESC' },
    });
  }

  async findOne(id: number) {
    const visita = await this.repo.findOne({
      where: { id },
      relations: ['casa', 'autorizadoPor'],
    });
    if (!visita) throw new NotFoundException('Visita no encontrada');
    return visita;
  }

  async create(dto: CreateVisitaDto) {
    const nueva = this.repo.create({
      ...dto,
      casa: { id: dto.id_casa },
      autorizadoPor: { id: dto.autorizado_por },
    });
    return this.repo.save(nueva);
  }

  async update(id: number, dto: UpdateVisitaDto) {
    const visita = await this.findOne(id);
    Object.assign(visita, dto);
    return this.repo.save(visita);
  }

  async remove(id: number) {
    const visita = await this.findOne(id);
    return this.repo.remove(visita);
  }
}
