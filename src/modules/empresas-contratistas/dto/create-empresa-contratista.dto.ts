import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

//DTO para crear una nueva empresa contratista en el sistema del condominio.
export class CreateEmpresaContratistaDto {
  @ApiProperty({
    example: 'Juan Sepúlveda',
    description: 'Nombre completo del encargado principal de la empresa contratista',
  })
  @IsNotEmpty({ message: 'El nombre del encargado es obligatorio' })
  @IsString()
  nombre_encargado: string;

  @ApiProperty({
    example: 'Constructora Génesis',
    description: 'Nombre comercial de la empresa contratista',
  })
  @IsNotEmpty({ message: 'El nombre de la empresa es obligatorio' })
  @IsString()
  nombre_empresa: string;

   @ApiProperty({
    example: '12345678-9',
    description: 'RUT chileno válido con guion',
  })
  @IsNotEmpty({ message: 'El RUT es obligatorio.' })
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, {
    message: 'El RUT debe tener un formato válido (ejemplo: 12345678-9).',
  })
  rut: string;


  @ApiPropertyOptional({
    example: 'Construcción y mantenimiento',
    description: 'Rubro o área de trabajo de la empresa (opcional)',
  })
  @IsOptional()
  @IsString()
  rubro?: string;

  @ApiPropertyOptional({
    example: '+56982736362',
    description: 'Teléfono de contacto de la empresa (opcional)',
  })
  @IsOptional()
  @Matches(/^\+?\d{8,15}$/, {
    message: 'El teléfono debe tener entre 8 y 15 dígitos, con o sin prefijo +56',
  })
  telefono?: string;

  @ApiPropertyOptional({
    example: 'contacto@genesis.cl',
    description: 'Correo electrónico de contacto (opcional)',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  email?: string;
}
