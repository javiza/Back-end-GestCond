import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsIn,
  Length,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVehiculoDto {
  @ApiProperty({ example: 'Carlos Pérez', description: 'Nombre del dueño del vehículo' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  nombre_dueño: string;

  @ApiProperty({ example: 'ABCD12', description: 'Patente única del vehículo' })
  @IsNotEmpty()
  @IsString()
  @Length(5, 10)
  patente: string;

  @ApiProperty({ example: 'Toyota', required: false })
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiProperty({ example: 'Corolla', required: false })
  @IsOptional()
  @IsString()
  modelo?: string;

  @ApiProperty({ example: 'Rojo', required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 'auto', enum: ['auto', 'moto'] })
  @IsNotEmpty()
  @IsIn(['auto', 'moto'])
  tipo_vehiculo: 'auto' | 'moto';

  @ApiProperty({ example: 1, description: 'ID de la casa a la que pertenece el vehículo' })
  @IsInt()
  @Min(1)
  id_casa: number;
}
