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
  @ApiProperty({ example: 'ABCD12' })
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
  @IsIn(['auto', 'moto'])
  tipo_vehiculo: string;

  @ApiProperty({ example: 'locatario', enum: ['locatario', 'integrante'] })
  @IsIn(['locatario', 'integrante'])
  tipo_propietario: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id_casa: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id_locatario: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  id_integrante?: number;
}
