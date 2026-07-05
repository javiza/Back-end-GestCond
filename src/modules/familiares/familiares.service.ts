import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Familiar } from './entities/familiare.entity';

import { CreateFamiliareDto } from './dto/create-familiare.dto';

import { UpdateFamiliareDto } from './dto/update-familiare.dto';

@Injectable()
export class FamiliaresService {
  constructor(
    @InjectRepository(Familiar)
    private repo: Repository<Familiar>,
  ) {}

  async create(dto: CreateFamiliareDto) {
    try {
      const nuevo = this.repo.create({
        nombre: dto.nombre,

        rut: dto.rut,

        parentesco: dto.parentesco,

        telefono: dto.telefono,

        email: dto.email,

        residente: {
          id: dto.id_residente,
        } as any,
      });

      return await this.repo.save(nuevo);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('RUT ya registrado.');
      }

      throw new InternalServerErrorException('Error creando familiar.');
    }
  }

  findAll() {
    return this.repo.find({
      relations: {residente:{
        casa:true
      }}  ,

      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number) {
    const familiar = await this.repo.findOne({
      where: { id },

      relations: {

      residente:{
        casa:true
      }
    }
    });

    if (!familiar) {
      throw new NotFoundException('Familiar no encontrado.');
    }

    return familiar;
  }

  async update(id:number,dto:UpdateFamiliareDto){

 const familiar = await this.findOne(id);

 const {
   id_residente,
   ...rest
 } = dto;

 Object.assign(
   familiar,
   rest
 );

 if(id_residente){

   familiar.residente = {
     id:id_residente
   } as any;

 }

 return this.repo.save(familiar);

}

  async remove(id: number) {
    const familiar = await this.findOne(id);

    await this.repo.remove(familiar);
  }
}
