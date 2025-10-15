import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Integrante } from './integrante.entity';
import { CreateIntegranteDto } from './dto/create-integrante.dto';
import { UpdateIntegranteDto } from './dto/update-integrante.dto';

@Injectable()
export class IntegrantesService {
  constructor(
    @InjectRepository(Integrante)
    private readonly repo: Repository<Integrante>,
  ) {}

  async create(dto: CreateIntegranteDto): Promise<Integrante> {
    const integrante = this.repo.create({
      nombre: dto.nombre,
      parentesco: dto.parentesco,
      casa: { id: dto.id_casa } as any,
      locatario: { id: dto.id_locatario } as any,
      vehiculo: dto.id_vehiculo ? ({ id: dto.id_vehiculo } as any) : null,
    });
    return await this.repo.save(integrante);
  }

  async findAll(): Promise<Integrante[]> {
    return this.repo.find({
      relations: ['locatario', 'casa', 'vehiculo'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Integrante> {
    const integrante = await this.repo.findOne({
      where: { id },
      relations: ['locatario', 'casa', 'vehiculo'],
    });
    if (!integrante) {
      throw new NotFoundException('Integrante no encontrado');
    }
    return integrante;
  }

  async update(id: number, dto: UpdateIntegranteDto): Promise<Integrante> {
    const integrante = await this.findOne(id);

    Object.assign(integrante, {
      nombre: dto.nombre ?? integrante.nombre,
      parentesco: dto.parentesco ?? integrante.parentesco,
      casa: dto.id_casa ? ({ id: dto.id_casa } as any) : integrante.casa,
      locatario: dto.id_locatario ? ({ id: dto.id_locatario } as any) : integrante.locatario,
      vehiculo: dto.id_vehiculo ? ({ id: dto.id_vehiculo } as any) : integrante.vehiculo,
    });

    return this.repo.save(integrante);
  }

  async remove(id: number): Promise<void> {
    const integrante = await this.findOne(id);
    await this.repo.remove(integrante);
  }
}
