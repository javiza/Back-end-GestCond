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

  // Listar todas las rondas con su turno asociado
  findAll() {
    return this.repo.find({
      relations: ['turno'], // ✅ coincide con la FK real
      order: { fecha_hora_inicio: 'DESC' },
    });
  }

  // Buscar una ronda por ID
  async findOne(id: number) {
    const ronda = await this.repo.findOne({
      where: { id },
      relations: ['turno'],
    });
    if (!ronda) throw new NotFoundException('Ronda no encontrada');
    return ronda;
  }

  // Crear una nueva ronda
  create(dto: CreateRondaDto) {
    const nueva = this.repo.create({
      observacion_ronda: dto.observacion_ronda,
      turno: dto.id_turno ? ({ id: dto.id_turno } as any) : undefined,
    });
    return this.repo.save(nueva);
  }

  // Actualizar una ronda existente
  async update(id: number, dto: UpdateRondaDto) {
    const ronda = await this.findOne(id);
    Object.assign(ronda, {
      observacion_ronda: dto.observacion_ronda ?? ronda.observacion_ronda,
    });
    if (dto.id_turno) ronda.turno = { id: dto.id_turno } as any;
    return this.repo.save(ronda);
  }

  // Eliminar una ronda
  async remove(id: number) {
    const ronda = await this.findOne(id);
    return this.repo.remove(ronda);
  }
}
