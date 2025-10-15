import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';

@Injectable()
export class RegistrosIngresosService {
  constructor(
    @InjectRepository(RegistroIngreso)
    private repo: Repository<RegistroIngreso>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['guardia', 'visita', 'personalInterno', 'personalExterno', 'casa'],
      order: { fecha_hora_ingreso: 'DESC' },
    });
  }

  async findOne(id: number) {
    const registro = await this.repo.findOne({
      where: { id },
      relations: ['guardia', 'visita', 'personalInterno', 'personalExterno', 'casa'],
    });
    if (!registro) throw new NotFoundException('Registro no encontrado');
    return registro;
  }

  create(dto: CreateRegistroIngresoDto) {
    const nuevo = this.repo.create(dto);
    return this.repo.save(nuevo);
  }

  async update(id: number, dto: UpdateRegistroIngresoDto) {
    const registro = await this.findOne(id);
    Object.assign(registro, dto);
    return this.repo.save(registro);
  }

  async registrarSalida(id: number) {
    const registro = await this.findOne(id);
    registro.fecha_hora_salida = new Date();
    return this.repo.save(registro);
  }

  async remove(id: number) {
    const registro = await this.findOne(id);
    return this.repo.remove(registro);
  }
}
