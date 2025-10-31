import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Casa } from './casa.entity';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';

@Injectable()
export class CasasService {
  constructor(
    @InjectRepository(Casa)
    private readonly repo: Repository<Casa>,
  ) {}

  // Listar todas las casas (ordenadas por número)
  findAll() {
    return this.repo.find({
      relations: ['residentes', 'vehiculos'], // 👈 útil para mostrar datos completos
      order: { numero: 'ASC' },
    });
  }

  // Buscar una casa por ID
  async findOne(id: number) {
    const casa = await this.repo.findOne({
      where: { id },
      relations: ['residentes', 'vehiculos'],
    });
    if (!casa) throw new NotFoundException(`La casa con ID ${id} no existe`);
    return casa;
  }

  // Crear nueva casa
  async create(dto: CreateCasaDto) {
    const existe = await this.repo.findOne({ where: { numero: dto.numero } });
    if (existe) {
      throw new BadRequestException(`Ya existe una casa con número ${dto.numero}`);
    }

    const nueva = this.repo.create(dto);
    return await this.repo.save(nueva);
  }

  // Actualizar datos de una casa existente
  async update(id: number, dto: UpdateCasaDto) {
    const casa = await this.findOne(id);

    // Evitar duplicar número de casa
    if (dto.numero && dto.numero !== casa.numero) {
      const repetida = await this.repo.findOne({ where: { numero: dto.numero } });
      if (repetida) {
        throw new BadRequestException(`El número ${dto.numero} ya está asignado a otra casa`);
      }
    }

    Object.assign(casa, dto);
    return await this.repo.save(casa);
  }

  // Eliminar casa (con verificación previa)
  async remove(id: number) {
    const casa = await this.findOne(id);
    return await this.repo.remove(casa);
  }
}
