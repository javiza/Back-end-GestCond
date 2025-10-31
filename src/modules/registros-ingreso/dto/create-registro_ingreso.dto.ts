import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Matches,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO: Crear Registro de Ingreso
 * Controla el ingreso de visitas, deliverys y trabajadores al condominio.
 */
export class CreateRegistroIngresoDto {
  @ApiProperty({
    example: 3,
    description: 'ID del guardia que registra el ingreso (FK hacia guardias)',
  })
  @IsNotEmpty({ message: 'El id_guardia es obligatorio' })
  @IsInt({ message: 'El id_guardia debe ser un número entero' })
  id_guardia: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID de la autorización QR (puede ser nulo si no aplica)',
  })
  @IsOptional()
  @IsInt({ message: 'El id_autorizacion_qr debe ser un número entero' })
  id_autorizacion_qr?: number;

  @ApiPropertyOptional({
    example: 'Juan Gómez',
    description: 'Nombre de la persona que ingresa (visitante, delivery, etc.)',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre?: string;

  @ApiPropertyOptional({
    example: '12345678-9',
    description: 'RUT chileno del visitante (formato válido con guion)',
  })
  @IsOptional()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, {
    message: 'RUT inválido. Ejemplo válido: 12345678-9',
  })
  rut?: string;

  @ApiPropertyOptional({
    example: 'ABCD12',
    description: 'Patente del vehículo que ingresa (si aplica)',
  })
  @IsOptional()
  @IsString({ message: 'La patente debe ser una cadena de texto' })
  patente?: string;

  @ApiPropertyOptional({
    example: 'auto',
    enum: ['moto', 'auto'],
    description: 'Tipo de vehículo (auto o moto, si aplica)',
  })
  @IsOptional()
  @IsIn(['moto', 'auto'], {
    message: 'El tipo de vehículo debe ser "moto" o "auto"',
  })
  tipo_vehiculo?: 'moto' | 'auto';

  @ApiProperty({
    example: 'Administrador Juan Pérez',
    description: 'Persona que autoriza el ingreso',
  })
  @IsNotEmpty({ message: 'El campo autorizado_por es obligatorio' })
  @IsString({ message: 'El autorizado_por debe ser una cadena de texto' })
  autorizado_por: string;

  @ApiProperty({
    example: 'visita',
    enum: ['visita', 'delivery', 'trabajador'],
    description: 'Tipo de visita registrada',
  })
  @IsNotEmpty({ message: 'El campo tipo_visita es obligatorio' })
  @IsIn(['visita', 'delivery', 'trabajador'], {
    message:
      'El tipo de visita debe ser "visita", "delivery" o "trabajador"',
  })
  tipo_visita: 'visita' | 'delivery' | 'trabajador';

  @ApiPropertyOptional({
    example: '2025-10-31T20:30:00Z',
    description: 'Fecha manual del ingreso (usualmente autogenerada)',
  })
  @IsOptional()
  fecha_hora_ingreso?: Date;
}
