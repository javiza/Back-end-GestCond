import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NoAutorizado } from './no-autorizado.entity';
import { CreateNoAutorizadoDto } from './dto/create-no-autorizado.dto';
import { UpdateNoAutorizadoDto } from './dto/update-no-autorizado.dto';
@Injectable()
export class NoAutorizadosService {
  constructor(
    @InjectRepository(NoAutorizado)
    private readonly repo: Repository<NoAutorizado>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['casa', 'administrador'],
      order: { fecha_hora: 'DESC' },
    });
  }

  async findOne(id: number) {
    const persona = await this.repo.findOne({
      where: { id },
      relations: ['casa', 'administrador'],
    });
    if (!persona) throw new NotFoundException('Registro no encontrado');
    return persona;
  }

  async create(dto: CreateNoAutorizadoDto) {
    const nuevo = this.repo.create(dto);
    return await this.repo.save(nuevo);
  }

  async update(id: number, dto: UpdateNoAutorizadoDto) {
    const persona = await this.findOne(id);
    Object.assign(persona, dto);
    return await this.repo.save(persona);
  }

  async remove(id: number) {
    const persona = await this.findOne(id);
    return await this.repo.remove(persona);
  }
}
