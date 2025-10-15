import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from './auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly repo: Repository<Auditoria>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async findByTable(tabla: string) {
    return this.repo.find({
      where: { tabla_afectada: tabla },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async findByAction(accion: string) {
    return this.repo.find({
      where: { accion },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  async findByUser(usuario_id: number) {
    return this.repo.find({
      where: { usuario: { id: usuario_id } },
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }
}
