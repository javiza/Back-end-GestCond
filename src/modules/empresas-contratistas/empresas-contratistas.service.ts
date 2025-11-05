import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async findAll(): Promise<EmpresaContratista[]> {
    return await this.repo.find({
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<EmpresaContratista> {
    const empresa = await this.repo.findOne({ where: { id } });
    if (!empresa) {
      throw new NotFoundException(`Empresa contratista con ID ${id} no encontrada`);
    }
    return empresa;
  }

  async create(dto: CreateEmpresaContratistaDto): Promise<EmpresaContratista> {
    try {
      // Limpieza de RUT (manteniendo el guion)
      const rutLimpio = dto.rut
        ? dto.rut.replace(/\./g, '').toUpperCase().trim()
        : null;

      // Validación con guion (coincide con CHECK de la BD)
      if (rutLimpio && !/^[0-9]{7,8}-[0-9K]$/.test(rutLimpio)) {
        throw new BadRequestException(
          'El formato del RUT no es válido. Ejemplo: 12345678-9',
        );
      }

      const nueva = this.repo.create({
        ...dto,
        rut: rutLimpio,
      });

      return await this.repo.save(nueva);
    } catch (error) {
      console.error('Error al crear empresa contratista:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('No se pudo registrar la empresa');
    }
  }

  async update(
    id: number,
    dto: UpdateEmpresaContratistaDto,
  ): Promise<EmpresaContratista> {
    const empresa = await this.findOne(id);

    // Limpieza y validación del RUT al actualizar
    const rutLimpio = dto.rut
      ? dto.rut.replace(/\./g, '').toUpperCase().trim()
      : empresa.rut;

    if (rutLimpio && !/^[0-9]{7,8}-[0-9K]$/.test(rutLimpio)) {
      throw new BadRequestException(
        'El formato del RUT no es válido. Ejemplo: 12345678-9',
      );
    }

    // Si se desactiva, registrar fecha de término
    if (dto.activa === false && empresa.activa) {
      empresa.fecha_termino = new Date();
    }

    Object.assign(empresa, dto, { rut: rutLimpio });

    try {
      return await this.repo.save(empresa);
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('No se pudo actualizar la empresa');
    }
  }

  async toggleActiva(id: number, activa: boolean): Promise<EmpresaContratista> {
    const empresa = await this.findOne(id);
    if (empresa.activa === activa) {
      throw new BadRequestException(
        `La empresa ya se encuentra en estado ${activa ? 'activo' : 'inactivo'}`,
      );
    }

    empresa.activa = activa;
    empresa.fecha_termino = activa ? null : new Date();

    return await this.repo.save(empresa);
  }

  async remove(id: number): Promise<{ message: string }> {
    const empresa = await this.findOne(id);
    await this.repo.remove(empresa);
    return { message: `Empresa contratista con ID ${id} eliminada del sistema` };
  }
}
