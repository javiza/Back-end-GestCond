import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trabajo } from './trabajo.entity';
import { CreateTrabajoDto } from './dto/create-trabajo.dto';
import { UpdateTrabajoDto } from './dto/update-trabajo.dto';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Injectable()
export class TrabajosService {
  constructor(
    @InjectRepository(Trabajo)
    private readonly repo: Repository<Trabajo>,

    @InjectRepository(PersonalInterno)
    private readonly personalRepo: Repository<PersonalInterno>,
  ) {}

  async create(dto: CreateTrabajoDto): Promise<Trabajo> {
    const personal = await this.personalRepo.findOne({
      where: { id: dto.id_personal_interno },
    });

    if (!personal) {
      throw new NotFoundException('Personal interno no encontrado');
    }

    // Usamos undefined en lugar de null
    const nuevoTrabajo = this.repo.create({
      trabajo_realizado: dto.trabajo_realizado,
      fecha_inicio: dto.fecha_inicio ? new Date(dto.fecha_inicio) : new Date(),
      fecha_termino: dto.fecha_termino ? new Date(dto.fecha_termino) : undefined,
      personal_interno: personal,
    });

    try {
      return await this.repo.save(nuevoTrabajo);
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Trabajo duplicado o datos inválidos');
      }
      throw e;
    }
  }

  async findAll(): Promise<Trabajo[]> {
    return this.repo.find({
      relations: ['personal_interno'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Trabajo> {
    const trabajo = await this.repo.findOne({
      where: { id },
      relations: ['personal_interno'],
    });

    if (!trabajo) throw new NotFoundException(`Trabajo con ID ${id} no encontrado`);
    return trabajo;
  }

  async update(id: number, dto: UpdateTrabajoDto): Promise<Trabajo> {
    const trabajo = await this.findOne(id);

    if (dto.id_personal_interno) {
      const personal = await this.personalRepo.findOne({
        where: { id: dto.id_personal_interno },
      });
      if (!personal) throw new NotFoundException('Personal interno no encontrado');
      trabajo.personal_interno = personal;
    }

    // Asignación segura
    Object.assign(trabajo, {
      ...dto,
      fecha_termino: dto.fecha_termino ? new Date(dto.fecha_termino) : trabajo.fecha_termino,
    });

    return await this.repo.save(trabajo);
  }

  async remove(id: number): Promise<void> {
    const trabajo = await this.findOne(id);
    await this.repo.remove(trabajo);
  }
}
