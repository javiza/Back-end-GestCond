import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateObservacionDto {
  @ApiProperty({ example: 'Guardia Luis Rojas', description: 'Nombre del guardia que realiza la observación' })
  @IsOptional()
  @IsString()
  nombre_guardia?: string;

  @ApiProperty({ example: 'Se detectó vehículo estacionado en zona no autorizada' })
  @IsNotEmpty()
  @IsString()
  observaciones: string;

  @ApiProperty({ example: 3, description: 'ID del guardia responsable' })
  @IsOptional()
  @IsInt()
  id_guardia?: number;
}
