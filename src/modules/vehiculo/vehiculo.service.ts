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

  if (
      (!!dto.id_residente && !!dto.id_familiar)
      ||
      (!dto.id_residente && !dto.id_familiar)
  ) {
      throw new ConflictException(
        'Debe seleccionar UN dueño: residente o familiar.'
      );
  }

  try {

    const nuevo=this.vehiculosRepo.create({

      patente:dto.patente,

      marca:dto.marca,

      modelo:dto.modelo,

      color:dto.color,

      tipo_vehiculo:dto.tipo_vehiculo,

      casa:{
        id:dto.id_casa
      } as any,

      residente:dto.id_residente
      ? {id:dto.id_residente} as any
      : null,

      familiar:dto.id_familiar
      ? {id:dto.id_familiar} as any
      : null

    });

    return await this.vehiculosRepo.save(nuevo);

  }
  catch(error: any){

      if(error.code==='23505'){
        throw new ConflictException(
          'Patente ya registrada.'
        );
      }

      throw new InternalServerErrorException(
        'Error registrando vehículo.'
      );
  }
}
  // Listar todos los vehículos
  async findAll():Promise<Vehiculo[]>{

    return this.vehiculosRepo.find({

        relations:[
            'casa',
            'residente',
            'familiar'
        ],

        order:{
            id:'ASC'
        }
    });
}

  // Buscar vehículo por ID
  async findOne(
    id:number
):Promise<Vehiculo>{

    const vehiculo=
    await this.vehiculosRepo.findOne({

        where:{id},

        relations:[
            'casa',
            'residente',
            'familiar'
        ]
    });

    if(!vehiculo){

        throw new NotFoundException(
            'Vehículo no encontrado.'
        );
    }

    return vehiculo;
}

  // Actualizar vehículo
  async update(
    id:number,
    dto:UpdateVehiculoDto
):Promise<Vehiculo>{

    const vehiculo=await this.findOne(id);

    Object.assign(vehiculo,dto);

    if(dto.id_casa){

        vehiculo.casa={
            id:dto.id_casa
        } as any;
    }

    if(dto.id_residente){

        vehiculo.residente={
            id:dto.id_residente
        } as any;

        vehiculo.familiar=null;
    }

    if(dto.id_familiar){

        vehiculo.familiar={
            id:dto.id_familiar
        } as any;

        vehiculo.residente=null;
    }

    return this.vehiculosRepo.save(vehiculo);
}

  // Eliminar vehículo
  async remove(id: number): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.vehiculosRepo.remove(vehiculo);
  }
}
