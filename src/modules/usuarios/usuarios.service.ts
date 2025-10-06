import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
  ) {}

async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
  const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

  const usuario = this.usuariosRepo.create({
    ...createUsuarioDto,
    password: hashedPassword,
  });

  try {
    return await this.usuariosRepo.save(usuario);
  } catch (e) {
    if (e.code === '23505') {
      throw new ConflictException('Email o RUT ya existen');
    }
    throw e;
  }
}

async findAll(): Promise<Usuario[]> {
  return this.usuariosRepo.find({
    where: { activo: true },
    select: ['id', 'nombre', 'rut', 'email', 'rol', 'activo', 'fecha_creacion'],
  });
}


  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({
      where: { id },
      select: ['id', 'nombre', 'rut', 'email', 'rol', 'fecha_creacion'],
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepo.findOne({
      where: { email },
      select: [
        'id',
        'nombre',
        'rut',
        'email',
        'password', // necesario para login
        'rol',
        'activo',
      ],
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
  const usuario = await this.usuariosRepo.findOne({ where: { id } });
  if (!usuario) {
    throw new NotFoundException('Usuario no encontrado');
  }

  Object.assign(usuario, updateUsuarioDto);

  if (updateUsuarioDto.password) {
    usuario.password = await bcrypt.hash(updateUsuarioDto.password, 10);
  }

  try {
    return await this.usuariosRepo.save(usuario);
  } catch (e) {
    if (e.code === '23505') {
      throw new ConflictException('Email o RUT ya existen');
    }
    throw e;
  }
}


  async remove(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    usuario.activo = false;
    return this.usuariosRepo.save(usuario);
  }
}
