import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsInt, MinLength, MaxLength, IsDateString } from 'class-validator';

export class CreateTrabajoDto {
  @ApiProperty({
    example: 'Revisión de cámaras de seguridad',
    description: 'Descripción o nombre del trabajo realizado',
  })
  @IsNotEmpty({ message: 'El campo "trabajo_realizado" es obligatorio.' })
  @IsString({ message: 'El trabajo realizado debe ser una cadena de texto.' })
  @MinLength(3, { message: 'Debe tener al menos 3 caracteres.' })
  @MaxLength(100, { message: 'No puede exceder los 100 caracteres.' })
  trabajo_realizado: string;

  @ApiProperty({
    example: '2025-10-31T09:00:00.000Z',
    required: false,
    description: 'Fecha de inicio del trabajo (opcional, se asigna automáticamente si no se envía)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Debe tener formato de fecha válido (ISO8601).' })
  fecha_inicio?: string;

  @ApiProperty({
    example: '2025-10-31T13:30:00.000Z',
    required: false,
    description: 'Fecha de término del trabajo (opcional)',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Debe tener formato de fecha válido (ISO8601).' })
  fecha_termino?: string;

  @ApiProperty({
    example: 5,
    description: 'ID del personal interno que realiza el trabajo',
  })
  @IsNotEmpty({ message: 'El campo id_personal_interno es obligatorio.' })
  @IsInt({ message: 'Debe ser un número entero.' })
  id_personal_interno: number;
}
