// src/modules/locatarios/locatarios.service.ts
import {
  Injectable, NotFoundException, ConflictException, BadRequestException, ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario, RolUsuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';
import { CreateLocatarioDto } from './dto/create-locatario.dto';
import { UpdateLocatarioDto } from './dto/update-locatario.dto';

@Injectable()
export class LocatariosService {
  constructor(
    @InjectRepository(Usuario) private readonly usuariosRepo: Repository<Usuario>,
    @InjectRepository(Casa) private readonly casasRepo: Repository<Casa>,
  ) {}

  // Crear locatario
  async create(dto: CreateLocatarioDto) {
    const casa = await this.casasRepo.findOne({ where: { id: dto.id_casa } });
    if (!casa) throw new BadRequestException('Casa no encontrada');

    const hashed = await bcrypt.hash(dto.password, 10);
    const entity = this.usuariosRepo.create({
      nombre: dto.nombre,
      rut: dto.rut,
      email: dto.email,
      password: hashed,
      rol: RolUsuario.LOCATARIO,
      activo: true,
      casa: { id: casa.id } as any,
    });

    try {
      const saved = await this.usuariosRepo.save(entity);
      // por defecto la columna password está select:false, no se regresa
      return await this.findOne(saved.id);
    } catch (e: any) {
      if (e.code === '23505') throw new ConflictException('Email o RUT ya existen');
      throw e;
    }
  }

  // Listar locatarios (admin/guardia)
  async findAll() {
    return this.usuariosRepo.find({
      where: { rol: RolUsuario.LOCATARIO, activo: true },
      relations: ['casa'],
      order: { id: 'ASC' },
    });
  }

  // Obtener uno
  async findOne(id: number) {
    const u = await this.usuariosRepo.findOne({
      where: { id, rol: RolUsuario.LOCATARIO },
      relations: ['casa'],
      select: ['id', 'nombre', 'rut', 'email', 'rol', 'activo', 'fecha_creacion'], // password oculto
    });
    if (!u) throw new NotFoundException('Locatario no encontrado');
    return u;
  }

  // Actualizar (admin) — mover de casa y/o datos del usuario
  // Actualizar (admin) — mover de casa y/o datos del usuario
async update(id: number, dto: UpdateLocatarioDto) {
  const locatario = await this.usuariosRepo.findOne({
    where: { id, rol: RolUsuario.LOCATARIO },
    relations: ['casa'],
  });
  if (!locatario) throw new NotFoundException('Locatario no encontrado');

  // 🔹 Si cambia de casa
  if (dto.id_casa !== undefined) {
    const nuevaCasa = await this.casasRepo.findOne({ where: { id: dto.id_casa } });
    if (!nuevaCasa) throw new BadRequestException('Casa no encontrada');
    locatario.casa = nuevaCasa; // ✅ asigna entidad completa, no solo el id
  }

  // 🔹 Actualizar datos personales
  if (dto.nombre !== undefined) locatario.nombre = dto.nombre;
  if (dto.rut !== undefined) locatario.rut = dto.rut;
  if (dto.email !== undefined) locatario.email = dto.email;

  // 🔹 Actualizar contraseña (si la envían)
  if (dto.password) {
    locatario.password = await bcrypt.hash(dto.password, 10);
  }

  try {
    await this.usuariosRepo.save(locatario);
    // Devuelve el locatario actualizado con su casa incluida
    return this.findOne(id);
  } catch (e: any) {
    if (e.code === '23505') throw new ConflictException('Email o RUT ya existen');
    throw e;
  }
}


  // Baja lógica (admin)
  async remove(id: number) {
    const u = await this.usuariosRepo.findOne({ where: { id, rol: RolUsuario.LOCATARIO } });
    if (!u) throw new NotFoundException('Locatario no encontrado');
    u.activo = false;
    await this.usuariosRepo.save(u);
  }

  // (Opcional) Locatario cambia su propia contraseña (PWA)
  async changeOwnPassword(userId: number, newPassword: string, requesterId: number) {
    if (userId !== requesterId) throw new ForbiddenException('No autorizado');

    const u = await this.usuariosRepo.findOne({
      where: { id: userId, rol: RolUsuario.LOCATARIO },
      select: ['id', 'password'], // necesitamos password para reemplazar
    });
    if (!u) throw new NotFoundException('Locatario no encontrado');

    u.password = await bcrypt.hash(newPassword, 10);
    await this.usuariosRepo.save(u);
    return { message: 'Contraseña actualizada' };
  }
}
