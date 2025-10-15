import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateRondaDto {
  @ApiProperty({ example: 'Guardia José Pérez' })
  @IsOptional()
  @IsString()
  nombre_guardia?: string;

  @ApiProperty({ example: 'Ronda completa sin novedades' })
  @IsNotEmpty()
  @IsString()
  observaciones: string;

  @ApiProperty({ example: 3, description: 'ID del guardia que realiza la ronda' })
  @IsOptional()
  @IsInt()
  id_guardia?: number;
}
