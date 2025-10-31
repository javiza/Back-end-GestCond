import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

//DTO para crear una nueva casa en el sistema del condominio.
export class CreateCasaDto {
  @ApiProperty({
    example: 'A-102',
    description: 'Número o identificador único de la casa dentro del condominio (ej. A-102).',
  })
  @IsNotEmpty({ message: 'El número de casa es obligatorio.' })
  @IsString({ message: 'El número debe ser una cadena de texto.' })
  @Length(1, 6, { message: 'El número debe tener entre 1 y 6 caracteres.' })
  numero: string;

  @ApiProperty({
    example: 'Av. Central 456, Condominio Los Álamos',
    description: 'Dirección completa de la casa o su ubicación dentro del condominio.',
  })
  @IsNotEmpty({ message: 'La dirección es obligatoria.' })
  @IsString({ message: 'La dirección debe ser una cadena de texto.' })
  @Length(5, 150, { message: 'La dirección debe tener entre 5 y 150 caracteres.' })
  direccion: string;
}
