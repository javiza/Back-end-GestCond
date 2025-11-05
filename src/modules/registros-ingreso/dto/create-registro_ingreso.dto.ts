import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsIn,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegistroIngresoDto {
    @ApiProperty({
    example: 3,
    description: 'ID del guardia que registra el ingreso (FK hacia guardias)',
  })
  @IsNotEmpty({ message: 'El id_guardia es obligatorio.' })
  @IsInt({ message: 'El id_guardia debe ser un número entero.' })
  id_guardia: number;
  
  @ApiPropertyOptional({
    example: 2,
    description: 'ID de la autorización QR (puede ser nulo si no aplica)',
  })
  @IsOptional()
  id_autorizacion_qr?: number;

  @ApiPropertyOptional({
    example: 'Juan Gómez',
    description: 'Nombre de la persona que ingresa (visitante, delivery, etc.)',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: '12345678-9',
    description: 'RUT chileno del visitante (formato válido con guion)',
  })
  @IsOptional()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, {
    message: 'RUT inválido. Ejemplo válido: 12345678-9.',
  })
  rut?: string;

  @ApiPropertyOptional({
    example: 'ABCD12',
    description: 'Patente del vehículo que ingresa (si aplica)',
  })
  @IsOptional()
  @IsString()
  patente?: string;

  @ApiPropertyOptional({
    example: 'camioneta',
    description: 'Tipo de vehículo (auto, moto, bicicleta, etc.)',
  })
  @IsOptional()
  @IsString()
  tipo_vehiculo?: string;

  @ApiProperty({
    example: 'Administrador Juan Pérez',
    description: 'Persona que autoriza el ingreso',
  })
  @IsNotEmpty()
  @IsString()
  autorizado_por: string;

  @ApiProperty({
    example: 'Casa 23 - Condominio Los Alerces',
    description: 'Lugar o destino del visitante dentro del condominio',
  })
  @IsNotEmpty()
  @IsString()
  lugar_destino: string;

  @ApiProperty({
    example: 'visita',
    enum: ['visita', 'delivery', 'trabajador'],
  })
  @IsNotEmpty()
  @IsIn(['visita', 'delivery', 'trabajador'])
  tipo_visita: 'visita' | 'delivery' | 'trabajador';

  @ApiPropertyOptional({
    example: '2025-10-31T20:30:00Z',
  })
  @IsOptional()
  fecha_hora_ingreso?: Date;
}
