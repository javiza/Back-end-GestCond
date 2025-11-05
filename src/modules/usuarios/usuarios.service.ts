import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './usuarios.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Guardia } from '../guardias/guardia.entity';

@Injectable()
export class UsuariosService {
 
  constructor(
    @InjectRepository(Usuario)
    private readonly usuariosRepo: Repository<Usuario>,
     @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    try {
      const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

      const usuario = this.usuariosRepo.create({
        ...createUsuarioDto,
        password: hashedPassword,
      });

      return await this.usuariosRepo.save(usuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          statusCode: 409,
          message: 'El email o RUT ya se encuentra registrado.',
          error: 'Conflict',
        });
      }
      throw new InternalServerErrorException(
        'Error interno al crear el usuario.',
      );
    }
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuariosRepo.find({
      where: { activo: true },
      order: { id: 'ASC' },
      select: [
        'id',
        'nombre',
        'rut',
        'email',
        'rol',
        'activo',
        'fecha_creacion',
      ],
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({
      where: { id },
      select: ['id', 'nombre', 'rut', 'email', 'rol', 'activo', 'fecha_creacion'],
    });

    if (!usuario) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Usuario con ID ${id} no encontrado.`,
      });
    }

    return usuario;
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuariosRepo.findOne({
      where: { email },
      select: [
        'id',
        'nombre',
        'rut',
        'email',
        'password', // necesario para validación de login
        'rol',
        'activo',
      ],
    });
  }

  //   Actualizar un usuario existente con validación de duplicados.
  
  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Usuario con ID ${id} no encontrado.`,
      });
    }

    Object.assign(usuario, updateUsuarioDto);

    if (updateUsuarioDto.password) {
      usuario.password = await bcrypt.hash(updateUsuarioDto.password, 10);
    }

    try {
      return await this.usuariosRepo.save(usuario);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException({
          statusCode: 409,
          message: 'El email o RUT ya se encuentra registrado.',
          error: 'Conflict',
        });
      }
      throw new InternalServerErrorException(
        'Error interno al actualizar el usuario.',
      );
    }
  }

  
   //Borrado lógico: desactiva el usuario (no elimina de BD).
   
  async remove(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepo.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Usuario con ID ${id} no encontrado.`,
      });
    }

    await this.usuariosRepo.update(id, { activo: false });

    // Devolver estado actualizado sin nueva consulta
    return { ...usuario, activo: false };
  }
   async findGuardiaByUsuarioId(id_usuario: number): Promise<Guardia | null> {
    return this.guardiasRepo.findOne({
      where: { usuario: { id: id_usuario } },
      relations: ['usuario'],
    });
  }
}
