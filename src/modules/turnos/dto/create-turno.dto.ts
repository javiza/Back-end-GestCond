import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  MaxLength,
} from 'class-validator';

export class CreateTurnoDto {
  @ApiProperty({
    example: 'Turno nocturno sin novedades',
    description: 'Observaciones o detalles generales del turno',
  })
  @IsNotEmpty({ message: 'La observación del turno es obligatoria' })
  @IsString({ message: 'La observación debe ser texto' })
  @MaxLength(500, { message: 'La observación no debe exceder los 500 caracteres' })
  observacion_turno: string;

  @ApiProperty({
    example: 1,
    description: 'ID del guardia que realiza el turno (FK a tabla guardias)',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El id_guardia debe ser un número entero válido' })
  id_guardia?: number;

  @ApiProperty({
    example: '2025-10-31T22:00:00Z',
    description: 'Fecha y hora de inicio del turno (opcional, se genera por defecto)',
    required: false,
  })
  @IsOptional()
  fecha_hora_inicio?: Date;

  @ApiProperty({
    example: '2025-11-01T06:00:00Z',
    description: 'Fecha y hora de término del turno (opcional)',
    required: false,
  })
  @IsOptional()
  fecha_hora_termino?: Date;
}
