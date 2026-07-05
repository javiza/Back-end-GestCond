import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  IsBoolean,
  IsEmail,
  IsInt,
  Length,
} from 'class-validator';
  //DTO para crear un residente.
export class CreateResidenteDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del residente' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre!: string;

  @ApiProperty({ example: '12345678-9', description: 'RUT chileno válido con guion' })
  @IsNotEmpty({ message: 'El RUT es obligatorio' })
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, { message: 'RUT inválido. Ejemplo: 12345678-9' })
  rut!: string;

  @ApiProperty({ example: 'juan.perez@correo.cl', description: 'Correo electrónico del residente' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  email!: string;

  @ApiPropertyOptional({ example: '+56 9 9876 5432', description: 'Teléfono de contacto del residente' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  @Length(6, 20, { message: 'El teléfono debe tener entre 6 y 20 caracteres' })
  telefono?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Estado activo o inactivo del residente (por defecto: true)',
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser booleano' })
  activo?: boolean;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID de la casa a la que pertenece el residente',
  })
  @IsOptional()
  @IsInt({ message: 'El id_casa debe ser un número entero' })
  id_casa?: number;

  @ApiPropertyOptional({
    example: 5,
    description: 'ID del usuario vinculado (si corresponde)',
  })
  @IsOptional()
  @IsInt({ message: 'El id_usuario debe ser un número entero' })
  id_usuario?: number;
}
