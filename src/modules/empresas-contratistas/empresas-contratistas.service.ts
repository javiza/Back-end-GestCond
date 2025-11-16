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

  private formatRut(rut: string): string | null {
    if (!rut) return null;
    let clean = rut.replace(/\./g, '').toUpperCase().trim();
    if (!clean.includes('-') && clean.length >= 2) {
      clean = `${clean.slice(0, -1)}-${clean.slice(-1)}`;
    }
    if (!/^[0-9]{7,8}-[0-9K]$/.test(clean)) {
      throw new BadRequestException('El formato del RUT no es válido. Ejemplo: 12345678-9');
    }
    return clean;
  }

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
      const rutLimpio = dto.rut ? this.formatRut(dto.rut) : null;

      const nueva = this.repo.create({
        ...dto,
        rut: rutLimpio,
      });

      return await this.repo.save(nueva);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('No se pudo registrar la empresa');
    }
  }

  async update(
    id: number,
    dto: UpdateEmpresaContratistaDto,
  ): Promise<EmpresaContratista> {
    const empresa = await this.findOne(id);

    const rutLimpio = dto.rut ? this.formatRut(dto.rut) : empresa.rut;

    if (dto.activa === false && empresa.activa) {
      empresa.fecha_termino = new Date();
    }

    Object.assign(empresa, dto, { rut: rutLimpio });

    try {
      return await this.repo.save(empresa);
    } catch (error) {
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

    if (!empresa.activa) {
      throw new BadRequestException(`La empresa con ID ${id} ya está inactiva.`);
    }

    empresa.activa = false;
    empresa.fecha_termino = new Date();

    await this.repo.save(empresa);

    return { message: `Empresa contratista con ID ${id} desactivada correctamente.` };
  }
}
