import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Residente } from './residente.entity';
import { CreateResidenteDto } from './dto/create-residente.dto';
import { UpdateResidenteDto } from './dto/update-residente.dto';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Injectable()
export class ResidentesService {
  constructor(
    @InjectRepository(Residente)
    private readonly repo: Repository<Residente>,

    @InjectRepository(Casa)
    private readonly casasRepo: Repository<Casa>,

    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

  async create(dto: CreateResidenteDto): Promise<Residente> {
    const nuevo = this.repo.create({
      nombre: dto.nombre,
      rut: dto.rut,
      email: dto.email,
      telefono: dto.telefono, 
      activo: dto.activo ?? true,
      casa: dto.id_casa ? ({ id: dto.id_casa } as Casa) : undefined,
      usuario: dto.id_usuario ? ({ id: dto.id_usuario } as Usuario) : undefined,
    });

    return await this.repo.save(nuevo);
  }

  async findAll(): Promise<Residente[]> {
    return this.repo.find({
      relations: ['casa', 'usuario'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Residente> {
    const residente = await this.repo.findOne({
      where: { id },
      relations: ['casa', 'usuario'],
    });

    if (!residente) {
      throw new NotFoundException(`Residente con ID ${id} no encontrado`);
    }

    return residente;
  }

  async update(id: number, dto: UpdateResidenteDto): Promise<Residente> {
    const residente = await this.findOne(id);

    Object.assign(residente, {
      ...dto,
      telefono: dto.telefono ?? residente.telefono,
      casa: dto.id_casa ? ({ id: dto.id_casa } as Casa) : residente.casa,
      usuario: dto.id_usuario ? ({ id: dto.id_usuario } as Usuario) : residente.usuario,
    });

    return await this.repo.save(residente);
  }

  async remove(id: number): Promise<void> {
    const residente = await this.findOne(id);
    await this.repo.remove(residente);
  }
}
