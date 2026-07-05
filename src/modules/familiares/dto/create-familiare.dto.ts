import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Length,
  IsInt,
  Min,
  Matches,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateFamiliareDto {

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del familiar'
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nombre!: string;

  @ApiProperty({
    example: '12345678-9',
    required: false,
    description: 'RUT del familiar'
  })
  @IsOptional()
  @IsString()
  @Matches(
    /^[0-9]{7,8}-[0-9kK]$/,
    {
      message: 'Formato de RUT inválido.'
    }
  )
  rut?: string;

  @ApiProperty({
    example: 'Hijo',
    required: false,
    description: 'Relación con el residente'
  })
  @IsOptional()
  @IsString()
  @Length(2,50)
  parentesco?: string;

  @ApiProperty({
    example: '+56912345678',
    required: false,
    description: 'Teléfono del familiar'
  })
  @IsOptional()
  @IsString()
  @Length(8,20)
  telefono?: string;

  @ApiProperty({
    example: 'juan@email.cl',
    required: false,
    description: 'Correo electrónico del familiar'
  })
  @IsOptional()
  @IsEmail(
    {},
    {
      message: 'Correo electrónico inválido.'
    }
  )
  email?: string;

  @ApiProperty({
    example: 1,
    description: 'ID del residente propietario'
  })
  @IsInt()
  @Min(
    1,
    {
      message:'El ID del residente debe ser mayor que 0.'
    }
  )
  id_residente!: number;

}