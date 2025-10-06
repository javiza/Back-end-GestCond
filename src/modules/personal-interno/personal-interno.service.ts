import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalInterno } from './personal-interno.entity';
import { CreatePersonalInternoDto } from './dto/create-personal-interno.dto';
import { UpdatePersonalInternoDto } from './dto/update-personal-interno.dto';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class PersonalInternoService {
  constructor(
    @InjectRepository(PersonalInterno) private readonly repo: Repository<PersonalInterno>,
    @InjectRepository(EmpresaContratista) private readonly empresas: Repository<EmpresaContratista>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
  ) {}

  async create(dto: CreatePersonalInternoDto) {
    const empresa = dto.id_empresa
  ? await this.empresas.findOne({ where: { id: dto.id_empresa } })
  : undefined;
    if (!empresa) {
      throw new NotFoundException('Empresa contratista no encontrada');
    }

    const usuario = dto.id_usuario
      ? await this.usuarios.findOne({ where: { id: dto.id_usuario } })
      : undefined;
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    const p = this.repo.create({
      nombre: dto.nombre, cargo: dto.cargo, rut: dto.rut,
      empresa_externa: dto.empresa_externa ?? false,
      empresa, usuario
    });
    return this.repo.save(p);
  }

  findAll() { return this.repo.find({ relations: ['empresa','usuario'] }); }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id }, relations: ['empresa','usuario'] });
    if (!p) {
      throw new NotFoundException('Personal no encontrado');
    }
    return p;
  }

  async update(id: number, dto: UpdatePersonalInternoDto) {
    const p = await this.findOne(id);
    if (dto.id_empresa !== undefined) {
      if (dto.id_empresa === null as any) {
        p.empresa = undefined;
      } else {
              const e = await this.empresas.findOne({ where: { id: dto.id_empresa } });
              if (!e) {
                throw new NotFoundException('Empresa no encontrada');
              }
              p.empresa = e;
            }
    }
    if (dto.id_usuario !== undefined) {
      if (dto.id_usuario === null as any) {
        p.usuario = undefined;
      } else {
              const u = await this.usuarios.findOne({ where: { id: dto.id_usuario } });
              if (!u) {
                throw new NotFoundException('Usuario no encontrado');
              }
              p.usuario = u;
            }
    }
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  async remove(id: number) {
    const p = await this.findOne(id);
    await this.repo.remove(p);
    return { deleted: true };
  }
}
