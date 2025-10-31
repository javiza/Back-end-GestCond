import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guardia } from './guardia.entity';
import { CreateGuardiaDto } from './dto/create-guardia.dto';
import { UpdateGuardiaDto } from './dto/update-guardia.dto';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class GuardiasService {
  constructor(
    @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(EmpresaContratista)
    private readonly empresasRepo: Repository<EmpresaContratista>,
  ) {}

  async create(dto: CreateGuardiaDto): Promise<Guardia> {
  try {
    const nuevo = this.guardiasRepo.create({
      nombre: dto.nombre,
      rut: dto.rut,
      email: dto.email,
      // Asignación de FKs por id sin SELECT extra:
      usuario: dto.id_usuario ? ({ id: dto.id_usuario } as any) : null,
      empresaContratista: dto.id_empresa_contratista
        ? ({ id: dto.id_empresa_contratista } as any)
        : null,
    });

    return await this.guardiasRepo.save(nuevo);
  } catch (error: any) {
    if (error.code === '23505') {
      // unique_violation (rut o email)
      throw new ConflictException('RUT o correo ya existen.');
    }
    throw new InternalServerErrorException('Error al crear el guardia.');
  }
}


  async findAll(): Promise<Guardia[]> {
  return this.guardiasRepo.find({
    relations: ['usuario', 'empresaContratista'],
    order: { id: 'ASC' },
  });
}

async findOne(id: number): Promise<Guardia> {
  const guardia = await this.guardiasRepo.findOne({
    where: { id },
    relations: ['usuario', 'empresaContratista'],
  });
  if (!guardia) throw new NotFoundException(`Guardia con ID ${id} no encontrado.`);
  return guardia; // objeto, no array
}


  async update(id: number, dto: UpdateGuardiaDto): Promise<Guardia> {
  const guardia = await this.findOne(id); // devuelve un objeto, no array

  // Campos simples
  if (dto.nombre !== undefined) guardia.nombre = dto.nombre;
  if (dto.rut !== undefined) guardia.rut = dto.rut;
  if (dto.email !== undefined) guardia.email = dto.email;
  if (dto.activo !== undefined) guardia.activo = dto.activo;

  // FKs por id sin SELECT extra:
  if (dto.id_usuario !== undefined) {
    guardia.usuario = dto.id_usuario ? ({ id: dto.id_usuario } as any) : null;
  }
  if (dto.id_empresa_contratista !== undefined) {
    guardia.empresaContratista = dto.id_empresa_contratista
      ? ({ id: dto.id_empresa_contratista } as any)
      : null;
  }

  try {
    return await this.guardiasRepo.save(guardia);
  } catch (error: any) {
    if (error.code === '23505') {
      throw new ConflictException('RUT o correo ya existen.');
    }
    throw new InternalServerErrorException('Error al actualizar el guardia.');
  }
}

  async remove(id: number): Promise<void> {
  const guardia = await this.findOne(id);
  guardia.activo = false;
  await this.guardiasRepo.save(guardia);
}
}
