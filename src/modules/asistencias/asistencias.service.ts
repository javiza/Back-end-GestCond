import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Asistencia } from './asistencia.entity';
import { CreateAsistenciaDto } from './dto/create-asistencia.dto';
import { UpdateAsistenciaDto } from './dto/update-asistencia.dto';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Injectable()
export class AsistenciasService {
  constructor(
    @InjectRepository(Asistencia) private readonly repo: Repository<Asistencia>,
    @InjectRepository(PersonalInterno) private readonly personal: Repository<PersonalInterno>,
  ) {}

  async create(dto: CreateAsistenciaDto) {
    const p = await this.personal.findOne({ where: { id: dto.id_personal } });
    if (!p) throw new NotFoundException('Personal no encontrado');
    const a = this.repo.create({
      personal: p, fecha: dto.fecha, hora_entrada: dto.hora_entrada,
      hora_salida: dto.hora_salida, observacion: dto.observacion
    });
    return this.repo.save(a);
  }

  findAll() { return this.repo.find({ relations: ['personal'] }); }

  async findOne(id: number) {
    const a = await this.repo.findOne({ where: { id }, relations: ['personal'] });
    if (!a) throw new NotFoundException('Asistencia no encontrada');
    return a;
  }

  async update(id: number, dto: UpdateAsistenciaDto) {
    const a = await this.findOne(id);
    if (dto.id_personal) {
      const p = await this.personal.findOne({ where: { id: dto.id_personal } });
      if (!p) throw new NotFoundException('Personal no encontrado');
      a.personal = p;
    }
    if (dto.fecha) a.fecha = dto.fecha as any;
    if (dto.hora_entrada) a.hora_entrada = dto.hora_entrada as any;
    if (dto.hora_salida) a.hora_salida = dto.hora_salida as any;
    if (dto.observacion) a.observacion = dto.observacion;
    return this.repo.save(a);
  }

  async remove(id: number) {
    const a = await this.findOne(id);
    await this.repo.remove(a);
    return { deleted: true };
  }
}
