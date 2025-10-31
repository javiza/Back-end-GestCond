import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateRondaDto {
  @ApiProperty({
    example: 'Ronda completa sin novedades',
    description: 'Observación o detalle registrado durante la ronda',
  })
  @IsNotEmpty({ message: 'La observación de la ronda es obligatoria' })
  @IsString({ message: 'La observación debe ser texto' })
  @MaxLength(500, { message: 'La observación no debe exceder 500 caracteres' })
  observacion_ronda: string;

  @ApiProperty({
    example: 2,
    description: 'ID del turno al que pertenece la ronda',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El id_turno debe ser un número entero válido' })
  id_turno?: number;
}
