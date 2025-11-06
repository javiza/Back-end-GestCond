import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, MaxLength } from 'class-validator';

export class UpdateTurnoDto {
  @ApiPropertyOptional({
    example: 'Se detectaron movimientos sospechosos en la cámara 3.',
    description: 'Actualización de la observación de inicio o evento durante el turno.',
  })
  @IsOptional()
  @IsString({ message: 'La observación debe ser texto.' })
  @MaxLength(500, { message: 'La observación no debe superar los 500 caracteres.' })
  observacion_inicio?: string;

  @ApiPropertyOptional({
    example: 'Finalizo el turno, entrego llaves y radio en recepción.',
    description: 'Observación de término del turno (opcional).',
  })
  @IsOptional()
  @IsString({ message: 'La observación de término debe ser texto.' })
  @MaxLength(500, { message: 'La observación no debe superar los 500 caracteres.' })
  observacion_termino?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID del guardia asignado al turno (opcional).',
  })
  @IsOptional()
  @IsInt({ message: 'El ID del guardia debe ser un número entero válido.' })
  id_guardia?: number;
}
