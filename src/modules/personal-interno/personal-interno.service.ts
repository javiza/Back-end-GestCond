import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersonalInterno } from './personal-interno.entity';
import { CreatePersonalInternoDto } from './dto/create-personal-interno.dto';
import { UpdatePersonalInternoDto } from './dto/update-personal-interno.dto';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
@Injectable()
export class PersonalInternoService {
  constructor(
    @InjectRepository(PersonalInterno)
    private readonly repo: Repository<PersonalInterno>,
    @InjectRepository(EmpresaContratista)
    private readonly empresaRepo: Repository<EmpresaContratista>,
  ) {}


  findAll() {
    return this.repo.find({
      relations: ['empresa_contratista'], 
      order: { id: 'DESC' },
    });
  }

 
  async findOne(id: number) {
    const persona = await this.repo.findOne({
      where: { id },
      relations: ['empresa_contratista'], 
    });

    if (!persona) throw new NotFoundException('Personal no encontrado');
    return persona;
  }


 async create(dto: CreatePersonalInternoDto) {
  const nuevo = this.repo.create({
    nombre: dto.nombre.trim(),
    rut: dto.rut.replace(/\./g, '').replace(/-/g, '').toUpperCase(),
    cargo: dto.cargo.trim(),
    activo: dto.activo ?? true,
    id_empresa_contratista: dto.id_empresa_contratista ?? null, // 🔹 ahora sí guarda la FK directamente
  });

  const guardado = await this.repo.save(nuevo);

  // Carga la empresa vinculada
  return this.repo.findOne({
    where: { id: guardado.id },
    relations: ['empresa_contratista'],
  });
}


  async update(id: number, dto: UpdatePersonalInternoDto) {
    const persona = await this.findOne(id);
    Object.assign(persona, dto);

    if (dto.id_empresa_contratista) {
      persona.empresa_contratista = { id: dto.id_empresa_contratista } as any;
    }

    return await this.repo.save(persona);
  }

 
  async toggleActivo(id: number, activo: boolean) {
    const persona = await this.findOne(id);
    persona.activo = activo;
    return await this.repo.save(persona);
  }


  async remove(id: number) {
    const persona = await this.findOne(id);
    return await this.repo.remove(persona);
  }
}
