import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ronda } from './ronda.entity';
import { CreateRondaDto } from './dto/create-ronda.dto';
import { UpdateRondaDto } from './dto/update-ronda.dto';

@Injectable()
export class RondasService {
  constructor(
    @InjectRepository(Ronda)
    private readonly repo: Repository<Ronda>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['guardia'],
      order: { fecha_inicio: 'DESC' },
    });
  }

  async findOne(id: number) {
    const ronda = await this.repo.findOne({ where: { id }, relations: ['guardia'] });
    if (!ronda) throw new NotFoundException('Ronda no encontrada');
    return ronda;
  }

  create(dto: CreateRondaDto) {
    const nueva = this.repo.create(dto);
    return this.repo.save(nueva);
  }

  async update(id: number, dto: UpdateRondaDto) {
    const ronda = await this.findOne(id);
    Object.assign(ronda, dto);
    return this.repo.save(ronda);
  }

  async remove(id: number) {
    const ronda = await this.findOne(id);
    return this.repo.remove(ronda);
  }
}
