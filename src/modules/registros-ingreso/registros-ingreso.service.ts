import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';


@Injectable()
export class RegistrosIngresosService {
  constructor(
    @InjectRepository(RegistroIngreso)
    private readonly repo: Repository<RegistroIngreso>,
  ) {}

  // Listar todos los registros con sus relaciones
  async findAll(): Promise<RegistroIngreso[]> {
    try {
      return await this.repo.find({
        relations: ['guardia', 'autorizacionQR'],
        order: { fechaHoraIngreso: 'DESC' },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Error al obtener los registros de ingreso.',
      );
    }
  }

  // Buscar un registro por ID
  async findOne(id: number): Promise<RegistroIngreso> {
    const registro = await this.repo.findOne({
      where: { id },
      relations: ['guardia', 'autorizacionQR'],
    });

    if (!registro) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }

    return registro;
  }

  // Crear un nuevo registro
  async create(dto: CreateRegistroIngresoDto): Promise<RegistroIngreso> {
    try {
      const nuevo = this.repo.create({
        ...dto,
        guardia: dto.id_guardia ? ({ id: dto.id_guardia } as any) : undefined,
        autorizacionQR: dto.id_autorizacion_qr
          ? ({ id: dto.id_autorizacion_qr } as any)
          : undefined,
      });

      return await this.repo.save(nuevo);
    } catch (error) {
      throw new InternalServerErrorException('Error al registrar el ingreso.');
    }
  }

  // Actualizar un registro existente (por ejemplo, salida manual o corrección)
  async update(id: number, dto: UpdateRegistroIngresoDto): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    Object.assign(registro, dto);

    try {
      return await this.repo.save(registro);
    } catch (error) {
      throw new InternalServerErrorException('Error al actualizar el registro.');
    }
  }

  // Registrar salida (marca fecha de salida actual)
  async registrarSalida(id: number): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    registro.fechaHoraSalida = new Date();
    try {
      return await this.repo.save(registro);
    } catch {
      throw new InternalServerErrorException('Error al registrar la salida.');
    }
  }

  //  Eliminar registro
  async remove(id: number): Promise<RegistroIngreso> {
    const registro = await this.findOne(id);
    try {
      return await this.repo.remove(registro);
    } catch {
      throw new InternalServerErrorException('Error al eliminar el registro.');
    }
  }
}
