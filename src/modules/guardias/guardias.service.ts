import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
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

  /**
   * Normaliza el RUT para guardarlo en BD respetando el CHECK:
   * - Elimina puntos.
   * - Asegura el guion antes del DV (si viene sin guion).
   * - DV en mayúscula.
   * Ej: "15.700.052-7" -> "15700052-7", "157000527" -> "15700052-7"
   */
  private normalizeRutForDb(rut: string): string {
    if (!rut) throw new BadRequestException('RUT vacío.');
    let clean = rut.replace(/\./g, '').toUpperCase().trim();

    // si viene con guion, lo dejamos
    if (clean.includes('-')) return clean;

    // si viene sin guion, lo insertamos antes del último carácter (DV)
    if (clean.length < 2) {
      throw new BadRequestException('RUT demasiado corto.');
    }
    const dv = clean.slice(-1);
    const cuerpo = clean.slice(0, -1);
    return `${cuerpo}-${dv}`;
  }

  async create(dto: CreateGuardiaDto): Promise<Guardia> {
    try {
      const rutNormalizado = this.normalizeRutForDb(dto.rut);

      // Duplicado por RUT o email (email es opcional)
      const existente = await this.guardiasRepo.findOne({
        where: [{ rut: rutNormalizado }, ...(dto.email ? [{ email: dto.email }] : [])],
      });
      if (existente) {
        throw new ConflictException('Ya existe un guardia con este RUT o correo.');
      }

      // Relaciones opcionales: validar existencia si mandan IDs
      let empresa: EmpresaContratista | null = null;
      let usuario: Usuario | null = null;

      if (dto.id_empresa_contratista !== undefined) {
        if (dto.id_empresa_contratista === null as any) {
          empresa = null;
        } else {
          const found = await this.empresasRepo.findOne({
            where: { id: dto.id_empresa_contratista },
          });
          if (!found) {
            throw new NotFoundException(
              `La empresa contratista con ID ${dto.id_empresa_contratista} no existe.`,
            );
          }
          empresa = found;
        }
      }

      if (dto.id_usuario !== undefined) {
        if (dto.id_usuario === null as any) {
          usuario = null;
        } else {
          const found = await this.usuariosRepo.findOne({
            where: { id: dto.id_usuario },
          });
          if (!found) {
            throw new NotFoundException(`El usuario con ID ${dto.id_usuario} no existe.`);
          }
          usuario = found;
        }
      }

      const nuevo = this.guardiasRepo.create({
        nombre: dto.nombre.trim(),
        rut: rutNormalizado,
        telefono: dto.telefono?.trim() ?? null,
        email: dto.email?.trim() ?? null,
        usuario,                // puede ser Usuario o null
        empresaContratista: empresa, // puede ser EmpresaContratista o null
      });

      const guardado = await this.guardiasRepo.save(nuevo);

      const completo = await this.guardiasRepo.findOne({
        where: { id: guardado.id },
        relations: ['usuario', 'empresaContratista'],
      });

      if (!completo) {
        throw new InternalServerErrorException('No se pudo cargar el guardia creado.');
      }

      return completo;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('RUT o correo ya existen.');
      }
      if (error.code === '23514') {
        // Viola el CHECK del RUT -> normalmente por guion faltante o formato
        throw new BadRequestException(
          'El RUT no cumple el formato requerido (ej: 12345678-9).',
        );
      }
      console.error('Error al crear guardia:', error);
      throw new InternalServerErrorException('Error al crear el guardia.');
    }
  }

  // async findAll(): Promise<Guardia[]> {
  //   return this.guardiasRepo.find({
  //     relations: ['usuario', 'empresaContratista'],
  //     order: { id: 'ASC' },
  //   });
  // }
  async findAll(): Promise<Guardia[]> {
  return this.guardiasRepo.find({
    select: ['id', 'nombre', 'rut', 'activo'], // solo los campos necesarios
    where: { activo: true },
    order: { nombre: 'ASC' },
  });
}


  async findOne(id: number): Promise<Guardia> {
    const guardia = await this.guardiasRepo.findOne({
      where: { id },
      relations: ['usuario', 'empresaContratista'],
    });
    if (!guardia) {
      throw new NotFoundException(`Guardia con ID ${id} no encontrado.`);
    }
    return guardia;
  }

  async update(id: number, dto: UpdateGuardiaDto): Promise<Guardia> {
    const guardia = await this.findOne(id);

    // Datos básicos
    if (dto.nombre !== undefined) guardia.nombre = dto.nombre.trim();
    if (dto.rut !== undefined) guardia.rut = this.normalizeRutForDb(dto.rut);
    if (dto.telefono !== undefined) guardia.telefono = dto.telefono?.trim() ?? null;
    if (dto.email !== undefined) guardia.email = dto.email?.trim() ?? null;
    if (dto.activo !== undefined) guardia.activo = dto.activo;

    // Empresa (nullable en BD → usar null para limpiar)
    if (dto.id_empresa_contratista !== undefined) {
      if (dto.id_empresa_contratista === null as any) {
        guardia.empresaContratista = null;
      } else {
        const empresa = await this.empresasRepo.findOne({
          where: { id: dto.id_empresa_contratista },
        });
        if (!empresa) {
          throw new NotFoundException(
            `La empresa contratista con ID ${dto.id_empresa_contratista} no existe.`,
          );
        }
        guardia.empresaContratista = empresa;
      }
    }

    // Usuario (nullable en BD → usar null para limpiar)
    if (dto.id_usuario !== undefined) {
      if (dto.id_usuario === null as any) {
        guardia.usuario = null;
      } else {
        const usuario = await this.usuariosRepo.findOne({
          where: { id: dto.id_usuario },
        });
        if (!usuario) {
          throw new NotFoundException(`El usuario con ID ${dto.id_usuario} no existe.`);
        }
        guardia.usuario = usuario;
      }
    }

    try {
      await this.guardiasRepo.save(guardia);
      return await this.findOne(id);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('RUT o correo ya existen.');
      }
      if (error.code === '23514') {
        throw new BadRequestException(
          'El RUT no cumple el formato requerido (ej: 12345678-9).',
        );
      }
      console.error('Error al actualizar guardia:', error);
      throw new InternalServerErrorException('Error al actualizar el guardia.');
    }
  }

  async remove(id: number): Promise<void> {
    const guardia = await this.findOne(id);
    guardia.activo = false;
    await this.guardiasRepo.save(guardia);
  }
}
