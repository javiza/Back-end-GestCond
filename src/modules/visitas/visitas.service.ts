import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Visita } from './visita.entity';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { sign } from 'jsonwebtoken'; //qr
@Injectable()
export class VisitasService {
  constructor(
    @InjectRepository(Visita) private readonly repo: Repository<Visita>,
    @InjectRepository(Casa) private readonly casas: Repository<Casa>,
    @InjectRepository(Usuario) private readonly usuarios: Repository<Usuario>,
  ) {}

  async create(dto: CreateVisitaDto) {
    const casa = await this.casas.findOne({ where: { id: dto.id_casa } });
    if (!casa) {
      throw new NotFoundException('Casa no encontrada');
    }
    const loc = await this.usuarios.findOne({ where: { id: dto.autorizado_por, rol: 'locatario' as any } });
    if (!loc) {
      throw new NotFoundException('Locatario no encontrado');
    }
    const visita = this.repo.create({ nombre: dto.nombre, rut: dto.rut, codigo_qr: dto.codigo_qr, casa, autorizadoPor: loc });
    return this.repo.save(visita);
  }

  findAll() {
    return this.repo.find({ relations: ['casa','autorizadoPor'] });
  }

  async findOne(id: number) {
    const v = await this.repo.findOne({ where: { id }, relations: ['casa','autorizadoPor'] });
    if (!v) {
      throw new NotFoundException('Visita no encontrada');
    }
    return v;
  }

  async update(id: number, dto: UpdateVisitaDto) {
    const v = await this.findOne(id);
    if (dto.id_casa) {
      const casa = await this.casas.findOne({ where: { id: dto.id_casa } });
      if (!casa) {
        throw new NotFoundException('Casa no encontrada');
      }
      v.casa = casa;
    }
    if (dto.autorizado_por) {
      const loc = await this.usuarios.findOne({ where: { id: dto.autorizado_por, rol: 'locatario' as any } });
      if (!loc) {
        throw new NotFoundException('Locatario no encontrado');
      }
      v.autorizadoPor = loc;
    }
    if (dto.nombre) {
      v.nombre = dto.nombre;
    }
    if (dto.rut) {
      v.rut = dto.rut;
    }
    if (dto.codigo_qr) {
      v.codigo_qr = dto.codigo_qr;
    }
    return this.repo.save(v);
  }

  async remove(id: number) {
    const v = await this.findOne(id);
    await this.repo.remove(v);
    return { deleted: true };
  }
  //para QR
  async generarCodigoQR(id: number) {
  const visita = await this.repo.findOne({ where: { id } });
  if (!visita) {
    throw new Error('Visita no encontrada');
  }

  const payload = { id: visita.id, rut: visita.rut, fecha: new Date() };
  const tokenQR = sign(payload, process.env.JWT_SECRET_QR!, { expiresIn: '24h' }); 

  visita.codigo_qr = tokenQR;
  await this.repo.save(visita);
  return { codigo_qr: tokenQR };
}

}

