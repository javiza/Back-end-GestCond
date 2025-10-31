import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreatePersonalInternoDto {
  @ApiProperty({ example: 'Juan Sepúlveda', description: 'Nombre completo del trabajador interno' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ example: '12345678-9', description: 'RUT del trabajador' })
  @IsNotEmpty({ message: 'El RUT es obligatorio' })
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, { message: 'Formato de RUT inválido. Ej: 12345678-9' })
  rut: string;

  @ApiProperty({ example: 'Técnico de mantenimiento', description: 'Cargo o función del trabajador' })
  @IsNotEmpty({ message: 'El cargo es obligatorio' })
  @IsString({ message: 'El cargo debe ser texto' })
  @MaxLength(100)
  cargo: string;

  @ApiProperty({
    example: 1,
    description: 'ID de la empresa contratista asociada (si aplica)',
    required: false,
  })
  @IsOptional()
  @IsInt({ message: 'El id_empresa_contratista debe ser un número entero' })
  id_empresa_contratista?: number;

  @ApiProperty({
    example: true,
    description: 'Indica si el personal está activo',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser booleano' })
  activo?: boolean;
}
