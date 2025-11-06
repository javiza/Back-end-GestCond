import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Turno } from './turno.entity';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { CerrarTurnoDto } from './dto/cerrar-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Guardia } from '../guardias/guardia.entity';

@Injectable()
export class TurnosService {
  constructor(
    @InjectRepository(Turno)
    private readonly repo: Repository<Turno>,

    @InjectRepository(Guardia)
    private readonly guardiasRepo: Repository<Guardia>,
  ) {}

  //  Crear turno (inicio)
async create(dto: CreateTurnoDto): Promise<Turno> {
  // Buscar guardia según id recibido
  const guardia = await this.guardiasRepo.findOne({ where: { id: dto.id_guardia } });
  if (!guardia) {
    throw new NotFoundException(`No se encontró un guardia con ID ${dto.id_guardia}.`);
  }

  // Crear turno con relación ManyToOne
  const nuevoTurno = this.repo.create({
    observacion_inicio: dto.observacion_inicio,
    guardia: guardia, // Asignar la entidad guardia completa
  });

  // Guardar turno y devolver con relación cargada
  
const guardado = await this.repo.save(nuevoTurno);
const turnoCompleto = await this.repo.findOne({
  where: { id: guardado.id },
  relations: ['guardia'],
});

if (!turnoCompleto) {
  throw new NotFoundException('Error al obtener el turno recién creado.');
}

return turnoCompleto;

}


  // Cerrar turno (término)
  async cerrarTurno(id: number, dto: CerrarTurnoDto): Promise<Turno> {
    const turno = await this.repo.findOne({ where: { id } });
    if (!turno) throw new NotFoundException('Turno no encontrado.');

    turno.observacion_termino = dto.observacion_termino;
    // fecha_hora_termino se actualiza automáticamente con @UpdateDateColumn
    return this.repo.save(turno);
  }

  //  Listar todos los turnos
  async findAll(): Promise<Turno[]> {
    return this.repo.find({
      relations: ['guardia'],
      order: { fecha_hora_inicio: 'DESC' },
    });
  }

  // Buscar un turno específico
  async findOne(id: number): Promise<Turno> {
    const turno = await this.repo.findOne({
      where: { id },
      relations: ['guardia'],
    });
    if (!turno) throw new NotFoundException('Turno no encontrado.');
    return turno;
  }

  // Actualizar turno (uso administrativo)
  async update(id: number, dto: UpdateTurnoDto): Promise<Turno> {
    const turno = await this.findOne(id);

    if (dto.id_guardia) {
      const guardia = await this.guardiasRepo.findOne({
        where: { id: dto.id_guardia },
      });
      if (!guardia)
        throw new NotFoundException('Guardia asociado no encontrado.');
      turno.guardia = guardia;
    }

    Object.assign(turno, dto);
    return this.repo.save(turno);
  }

  //  Eliminar turno
  async remove(id: number): Promise<void> {
    const turno = await this.findOne(id);
    await this.repo.remove(turno);
  }
}
