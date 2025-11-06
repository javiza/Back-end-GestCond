import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsInt } from 'class-validator';

export class CreateTurnoDto {
  @ApiProperty({
    example: 'Inicio del turno sin novedades',
    description: 'Observación escrita por el guardia al iniciar su turno.',
  })
  @IsNotEmpty({ message: 'Debe registrar una observación de inicio.' })
  @IsString({ message: 'La observación de inicio debe ser texto.' })
  observacion_inicio: string;

  @ApiProperty({
    example: 1,
    description: 'ID del guardia que inicia el turno (asignado automáticamente si está autenticado).',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El ID del guardia debe ser un número entero válido.' })
  id_guardia?: number;
}
