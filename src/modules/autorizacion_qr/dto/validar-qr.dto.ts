import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  Matches,
} from 'class-validator';
  //DTO para validar un código QR escaneado por el guardia.
export class ValidarQRDto {
  @ApiProperty({
    example: 'QR-ABCD1234',
    description: 'Código QR escaneado o leído por el guardia.',
  })
  @IsString({ message: 'El código QR debe ser texto.' })
  @IsNotEmpty({ message: 'El código QR es obligatorio.' })
  codigo_qr: string;

  @ApiProperty({
    example: 'delivery',
    enum: ['visita', 'delivery', 'trabajador'],
    description: 'Tipo de visita correspondiente al código QR.',
  })
  @IsIn(['visita', 'delivery', 'trabajador'], {
    message: 'El tipo de visita debe ser "visita", "delivery" o "trabajador".',
  })
  tipo_visita: 'visita' | 'delivery' | 'trabajador';

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del visitante, delivery o trabajador autorizado.',
  })
  @IsString({ message: 'El nombre debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre es obligatorio.' })
  nombre: string;

  @ApiProperty({
    example: '12345678-9',
    required: false,
    description: 'RUT chileno válido, formato 12345678-9.',
  })
  @IsOptional()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, { message: 'RUT inválido. Ejemplo: 12345678-9.' })
  rut?: string;

  @ApiProperty({
    example: 'AA-BB-11',
    required: false,
    description: 'Patente del vehículo (si aplica).',
  })
  @IsOptional()
  @IsString({ message: 'La patente debe ser texto.' })
  patente?: string;

  @ApiProperty({
    example: 'auto',
    required: false,
    enum: ['auto', 'moto'],
    description: 'Tipo de vehículo asociado (si aplica).',
  })
  @IsOptional()
  @IsIn(['auto', 'moto'], {
    message: 'El tipo de vehículo debe ser "auto" o "moto".',
  })
  tipo_vehiculo?: 'auto' | 'moto';

  @ApiProperty({
    example: 5,
    description: 'ID del guardia que escanea o valida el QR.',
  })
  @IsInt({ message: 'El id_guardia debe ser un número entero.' })
  id_guardia: number;
}
