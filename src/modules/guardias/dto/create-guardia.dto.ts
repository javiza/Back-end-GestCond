import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Matches,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

//DTO para crear un nuevo guardia en el sistema del condominio.
export class CreateGuardiaDto {
  @ApiProperty({
    example: 'Carlos Pérez',
    description: 'Nombre completo del guardia',
  })
  @IsNotEmpty({ message: 'El nombre del guardia es obligatorio.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  nombre: string;

  @ApiProperty({
    example: '12345678-9',
    description: 'RUT chileno válido con guion',
  })
  @IsNotEmpty({ message: 'El RUT es obligatorio.' })
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, {
    message: 'El RUT debe tener un formato válido (ejemplo: 12345678-9).',
  })
  rut: string;

  @ApiProperty({
    example: 'carlos.perez@correo.cl',
    description: 'Correo electrónico del guardia',
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido.' })
  email: string;

  @ApiPropertyOptional({
    example: 1,
    description:
      'ID del usuario asociado (FK a tabla usuarios). Puede ser nulo.',
  })
  @IsOptional()
  @IsInt({ message: 'El id_usuario debe ser un número entero.' })
  @Min(1, { message: 'El id_usuario debe ser mayor que 0.' })
  id_usuario?: number;

  @ApiPropertyOptional({
    example: 2,
    description:
      'ID de la empresa contratista a la que pertenece el guardia (FK).',
  })
  @IsOptional()
  @IsInt({ message: 'El id_empresa_contratista debe ser un número entero.' })
  @Min(1, { message: 'El id_empresa_contratista debe ser mayor que 0.' })
  id_empresa_contratista?: number;
}
