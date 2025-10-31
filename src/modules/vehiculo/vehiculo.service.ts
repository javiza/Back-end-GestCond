import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';

@Injectable()
export class VehiculosService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculosRepo: Repository<Vehiculo>,
  ) {}

  // Crear vehículo
  async create(dto: CreateVehiculoDto): Promise<Vehiculo> {
    try {
      const nuevo = this.vehiculosRepo.create({
        nombre_dueño: dto.nombre_dueño,
        patente: dto.patente,
        marca: dto.marca,
        modelo: dto.modelo,
        color: dto.color,
        tipo_vehiculo: dto.tipo_vehiculo,
        casa: { id: dto.id_casa } as any,
      });

      return await this.vehiculosRepo.save(nuevo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('La patente ya está registrada.');
      }
      throw new InternalServerErrorException('Error al registrar el vehículo.');
    }
  }

  // Listar todos los vehículos
  async findAll(): Promise<Vehiculo[]> {
    return this.vehiculosRepo.find({
      relations: ['casa'],
      order: { id: 'ASC' },
    });
  }

  // Buscar vehículo por ID
  async findOne(id: number): Promise<Vehiculo> {
    const vehiculo = await this.vehiculosRepo.findOne({
      where: { id },
      relations: ['casa'],
    });

    if (!vehiculo) {
      throw new NotFoundException(`Vehículo con ID ${id} no encontrado.`);
    }

    return vehiculo;
  }

  // Actualizar vehículo
  async update(id: number, dto: UpdateVehiculoDto): Promise<Vehiculo> {
    const vehiculo = await this.findOne(id);
    Object.assign(vehiculo, dto);

    if (dto.id_casa) {
      vehiculo.casa = { id: dto.id_casa } as any;
    }

    try {
      return await this.vehiculosRepo.save(vehiculo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('La patente ya está registrada.');
      }
      throw new InternalServerErrorException('Error al actualizar el vehículo.');
    }
  }

  // Eliminar vehículo
  async remove(id: number): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.vehiculosRepo.remove(vehiculo);
  }
}
