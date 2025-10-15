import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalInterno } from './personal-interno.entity';
import { CreatePersonalInternoDto } from './dto/create-personal-interno.dto';
import { UpdatePersonalInternoDto } from './dto/update-personal-interno.dto';

@Injectable()
export class PersonalInternoService {
  constructor(
    @InjectRepository(PersonalInterno)
    private readonly repo: Repository<PersonalInterno>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['empresa', 'administrador'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number) {
    const persona = await this.repo.findOne({
      where: { id },
      relations: ['empresa', 'administrador'],
    });
    if (!persona) {
      throw new NotFoundException('Personal no encontrado');
    }
    return persona;
  }

  async create(dto: CreatePersonalInternoDto) {
    const nuevo = this.repo.create(dto);
    return await this.repo.save(nuevo);
  }

  async update(id: number, dto: UpdatePersonalInternoDto) {
    const persona = await this.findOne(id);
    Object.assign(persona, dto);
    return await this.repo.save(persona);
  }

  async toggleActivo(id: number, activo: boolean) {
    const persona = await this.findOne(id);
    persona.activo = activo;
    return await this.repo.save(persona);
  }

  async remove(id: number) {
    const persona = await this.findOne(id);
    return await this.repo.remove(persona);
  }
}
