import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Auditoria } from './auditoria.entity';

@Injectable()
export class AuditoriaService {
  constructor(
    @InjectRepository(Auditoria)
    private readonly repo: Repository<Auditoria>,
  ) {}

  
   // Listar todos los registros de auditoría
   // Opcionalmente filtrando por tabla o rango de fechas
   
  async findAll(filtros?: { tabla?: string; desde?: string; hasta?: string }) {
    const where: any = {};

    if (filtros?.tabla) {
      where.tabla_afectada = Like(`%${filtros.tabla}%`);
    }

    if (filtros?.desde && filtros?.hasta) {
      where.fecha = Between(new Date(filtros.desde), new Date(filtros.hasta));
    }

    return this.repo.find({
      where,
      relations: ['usuario'],
      order: { fecha: 'DESC' },
    });
  }

  // Buscar registro específico
  async findOne(id: number) {
    const registro = await this.repo.findOne({ where: { id }, relations: ['usuario'] });
    if (!registro) throw new NotFoundException('Registro de auditoría no encontrado');
    return registro;
  }

 
   //Borrar registros antiguos (mantenimiento)
   
  async clearOld(fecha_limite: string) {
    const result = await this.repo
      .createQueryBuilder()
      .delete()
      .where('fecha < :fecha', { fecha: fecha_limite })
      .execute();

    return { message: `Registros eliminados: ${result.affected}` };
  }
}
