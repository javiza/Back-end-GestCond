import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Observacion } from './observacione.entity';
import { CreateObservacionDto } from './dto/create-observacione.dto';
import { UpdateObservacionDto } from './dto/update-observacione.dto';

@Injectable()
export class ObservacionesService {
  constructor(
    @InjectRepository(Observacion)
    private readonly repo: Repository<Observacion>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['guardia'],
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number) {
    const obs = await this.repo.findOne({
      where: { id },
      relations: ['guardia'],
    });
    if (!obs) throw new NotFoundException('Observación no encontrada');
    return obs;
  }

  create(dto: CreateObservacionDto) {
    const nueva = this.repo.create(dto);
    return this.repo.save(nueva);
  }

  async update(id: number, dto: UpdateObservacionDto) {
    const obs = await this.findOne(id);
    Object.assign(obs, dto);
    return this.repo.save(obs);
  }

  async remove(id: number) {
    const obs = await this.findOne(id);
    return this.repo.remove(obs);
  }
}
