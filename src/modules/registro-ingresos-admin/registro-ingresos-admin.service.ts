import { CreateRegistroIngresosAdminDto } from './dto/create-registro-ingresos-admin.dto';
import { UpdateRegistroIngresosAdminDto } from './dto/update-registro-ingresos-admin.dto';
import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { RegistroIngreso } from '../registros-ingreso/registro-ingreso.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class RegistroIngresosAdminService {

constructor(
    @InjectRepository(RegistroIngreso)
    private readonly repo: Repository<RegistroIngreso>,

  
  ) {}


  create(createRegistroIngresosAdminDto: CreateRegistroIngresosAdminDto) {
    return 'This action adds a new registroIngresosAdmin';
  }

  findAll() {
    return `This action returns all registroIngresosAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} registroIngresosAdmin`;
  }

  update(id: number, updateRegistroIngresosAdminDto: UpdateRegistroIngresosAdminDto) {
    return `This action updates a #${id} registroIngresosAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} registroIngresosAdmin`;
  }
   async listarTodasVisitas(): Promise<RegistroIngreso[]> {
    try {
      return await this.repo.find({
        relations: ['guardia', 'autorizacionQR'],
        order: { fechaHoraIngreso: 'DESC' },
      });
    } catch (error) {
      console.error(' Error al listar todas las visitas:', error);
      throw new InternalServerErrorException('Error al listar todas las visitas registradas.');
    }
  }
}
