import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsInt,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateVehiculoDto {

  @ApiProperty({
    example:'ABCD12',
    description:'Patente única'
  })
  @IsNotEmpty()
  @IsString()
  @Length(5,10)
  patente!:string;

  @ApiProperty({
    example:'Toyota',
    required:false
  })
  @IsOptional()
  @IsString()
  marca?:string;

  @ApiProperty({
    example:'Corolla',
    required:false
  })
  @IsOptional()
  @IsString()
  modelo?:string;

  @ApiProperty({
    example:'Rojo',
    required:false
  })
  @IsOptional()
  @IsString()
  color?:string;

  @ApiProperty({
    example:'camioneta'
  })
  @IsNotEmpty()
  @IsString()
  tipo_vehiculo!:string;

  @ApiProperty({
    example:1
  })
  @IsInt()
  @Min(1)
  id_casa!:number;

  @ApiProperty({
    example:3,
    required:false,
    description:'ID residente dueño'
  })
  @IsOptional()
  @IsInt()
  id_residente?:number;

  @ApiProperty({
    example:2,
    required:false,
    description:'ID familiar dueño'
  })
  @IsOptional()
  @IsInt()
  id_familiar?:number;

}