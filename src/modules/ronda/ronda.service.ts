import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Ronda } from './ronda.entity';
import { CreateRondaDto } from './dto/create-ronda.dto';
import { UpdateRondaDto } from './dto/update-ronda.dto';
import { Turno } from '../turnos/turno.entity';

@Injectable()
export class RondasService {
  constructor(
    @InjectRepository(Ronda)
    private readonly repo: Repository<Ronda>,

    @InjectRepository(Turno)
    private readonly turnosRepo: Repository<Turno>,
  ) {}

  // Listar todas las rondas con el turno y guardia asociados
  findAll() {
    return this.repo.find({
      relations: ['turno', 'turno.guardia'],
      order: { fecha_hora_inicio: 'DESC' },
    });
  }

  // Buscar una ronda específica
  async findOne(id: number) {
    const ronda = await this.repo.findOne({
      where: { id },
      relations: ['turno', 'turno.guardia'],
    });
    if (!ronda) throw new NotFoundException('Ronda no encontrada');
    return ronda;
  }

  // Crear una nueva ronda asociada al turno activo del guardia
  async create(dto: CreateRondaDto): Promise<Ronda> {
  // Buscar turno activo
  const turnoActivo = await this.turnosRepo.findOne({
    where: { observacion_termino: IsNull() },
    relations: ['guardia'],
    order: { fecha_hora_inicio: 'DESC' },
  });

  if (!turnoActivo) {
    throw new BadRequestException('No hay un turno activo de guardia en este momento.');
  }

  // ================================
  //   GENERAR FECHA CHILE REAL
  // ================================
  const fechaChile = new Date(
    new Date().toLocaleString('sv-SE', { timeZone: 'America/Santiago' })
      .replace(' ', 'T')
  );

  // Crear nueva ronda con hora chilena
  const nueva = this.repo.create({
    observacion_ronda: dto.observacion_ronda,
    turno: turnoActivo,
    fecha_hora_inicio: fechaChile,
    fecha_hora_termino: fechaChile, // Se inicia igual, y luego se actualizará
  });

  return this.repo.save(nueva);
}


  // Actualizar una ronda existente
  async update(id: number, dto: UpdateRondaDto) {
    const ronda = await this.findOne(id);
    Object.assign(ronda, {
      observacion_ronda: dto.observacion_ronda ?? ronda.observacion_ronda,
    });
    return this.repo.save(ronda);
  }

  // Eliminar una ronda
  async remove(id: number) {
    const ronda = await this.findOne(id);
    return this.repo.remove(ronda);
  }
}
