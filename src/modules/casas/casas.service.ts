import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Casa } from './casa.entity';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';

@Injectable()
export class CasasService {
  constructor(
    @InjectRepository(Casa)
    private readonly repo: Repository<Casa>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const casa = await this.repo.findOne({ where: { id } });
    if (!casa) throw new NotFoundException('Casa no encontrada');
    return casa;
  }

  async create(dto: CreateCasaDto) {
    const nueva = this.repo.create(dto);
    return this.repo.save(nueva);
  }

  async update(id: number, dto: UpdateCasaDto) {
    const casa = await this.findOne(id);
    Object.assign(casa, dto);
    return this.repo.save(casa);
  }

  async remove(id: number) {
    const casa = await this.findOne(id);
    return this.repo.remove(casa);
  }
}
