import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaContratista } from './empresa-contratista.entity';
import { CreateEmpresaContratistaDto } from './dto/create-empresa-contratista.dto';
import { UpdateEmpresaContratistaDto } from './dto/update-empresa-contratista.dto';

@Injectable()
export class EmpresasContratistasService {
  constructor(@InjectRepository(EmpresaContratista) private readonly repo: Repository<EmpresaContratista>) {}

  create(dto: CreateEmpresaContratistaDto) {
    return this.repo.save(this.repo.create(dto));
  }

  findAll() { return this.repo.find(); }

  async findOne(id: number) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Empresa no encontrada');
    return e;
  }

  async update(id: number, dto: UpdateEmpresaContratistaDto) {
    const e = await this.findOne(id);
    Object.assign(e, dto);
    return this.repo.save(e);
  }

  async remove(id: number) {
    const e = await this.findOne(id);
    await this.repo.remove(e);
    return { deleted: true };
  }
}
