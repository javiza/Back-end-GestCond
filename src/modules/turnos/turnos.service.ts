import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Guardia } from '../guardias/guardia.entity';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly repo: Repository<Turno>,

    @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,
  ) {}

  async create(dto: CreateTurnoDto): Promise<Turno> {
    try {
      const guardia = dto.id_guardia
        ? await this.guardiasRepo.findOne({ where: { id: dto.id_guardia } })
        : undefined; 

      const nuevoTurno = this.repo.create({
        // estos campos deben existir en turno.entity.ts
        observacion_turno: dto.observacion_turno,
        fecha_hora_inicio: dto.fecha_hora_inicio ?? new Date(),
        fecha_hora_termino: dto.fecha_hora_termino ?? new Date(),
        guardia, 
      } as Partial<Turno>); // esto fuerza el tipo correcto para evitar error de tipado

      return await this.repo.save(nuevoTurno);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Error: turno duplicado o datos inválidos.');
      }
      throw error;
    }
  }

  async findAll(): Promise<Turno[]> {
    return this.repo.find({
      relations: ['guardia', 'rondas'],
      order: { fecha_hora_inicio: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Turno> {
    const turno = await this.repo.findOne({
      where: { id },
      relations: ['guardia', 'rondas'],
    });

    if (!turno) {
      throw new NotFoundException(`Turno con ID ${id} no encontrado.`);
    }

    return turno;
  }

  async update(id: number, dto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);

    if (dto.id_guardia) {
      const guardia = await this.guardiasRepo.findOne({ where: { id: dto.id_guardia } });
      if (!guardia) throw new NotFoundException('Guardia no encontrado');
      turno.guardia = guardia;
    }

    Object.assign(turno, dto);
    return this.repo.save(turno);
  }

  async remove(id: number): Promise<void> {
    const turno = await this.findOne(id);
    await this.repo.remove(turno);
  }
}
