import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { CreateRegistroIngresoDto } from './dto/create-registro-ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { Visita } from '../visitas/visita.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class RegistrosIngresoService {
  constructor(
    @InjectRepository(RegistroIngreso) private readonly repo: Repository<RegistroIngreso>,
    @InjectRepository(Visita) private readonly visitas: Repository<Visita>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
  ) {}

  async create(dto: CreateRegistroIngresoDto) {
    const visita =
  dto.id_visita
    ? (await this.visitas.findOne({ where: { id: dto.id_visita } })) ?? undefined
    : undefined;

if (dto.id_visita && !visita) {
  throw new NotFoundException('Visita no encontrada');
}

    const guardia = await this.usuarios.findOne({ where: { id: dto.id_guardia, rol: 'guardia' as any } });
    if (!guardia) {
      throw new NotFoundException('Guardia no encontrado');
    }
    const reg = this.repo.create({ visita, guardia });
    return this.repo.save(reg);
  }

  findAll() {
    return this.repo.find({ relations: ['visita','guardia'] });
  }

  async findOne(id: number) {
    const r = await this.repo.findOne({ where: { id }, relations: ['visita','guardia'] });
    if (!r) {
      throw new NotFoundException('Registro no encontrado');
    }
    return r;
  }

  async marcarSalida(id: number, dto: UpdateRegistroIngresoDto) {
    const r = await this.findOne(id);
    r.fecha_hora_salida = dto.fecha_hora_salida ? new Date(dto.fecha_hora_salida) : new Date();
    return this.repo.save(r);
  }

  async remove(id: number) {
    const r = await this.findOne(id);
    await this.repo.remove(r);
    return { deleted: true };
  }
}
