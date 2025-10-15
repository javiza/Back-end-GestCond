import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmpresaContratista } from './empresa-contratista.entity';
import { CreateEmpresaContratistaDto } from './dto/create-empresa-contratista.dto';
import { UpdateEmpresaContratistaDto } from './dto/update-empresa-contratista.dto';

@Injectable()
export class EmpresasContratistasService {
  constructor(
    @InjectRepository(EmpresaContratista)
    private readonly repo: Repository<EmpresaContratista>,
  ) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const empresa = await this.repo.findOne({ where: { id } });
    if (!empresa) throw new NotFoundException('Empresa no encontrada');
    return empresa;
  }

  async create(dto: CreateEmpresaContratistaDto) {
    const nueva = this.repo.create(dto);
    return await this.repo.save(nueva);
  }

  async update(id: number, dto: UpdateEmpresaContratistaDto) {
    const empresa = await this.findOne(id);
    Object.assign(empresa, dto);
    return await this.repo.save(empresa);
  }

  async toggleActiva(id: number, activa: boolean) {
    const empresa = await this.findOne(id);
    empresa.activa = activa;
    return await this.repo.save(empresa);
  }

  async remove(id: number) {
    const empresa = await this.findOne(id);
    return await this.repo.remove(empresa);
  }
}
