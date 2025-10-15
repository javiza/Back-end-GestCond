import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateCasaDto {
  @ApiProperty({ example: 'A-102', description: 'Número de la casa' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 6)
  numero: string;

  @ApiProperty({ example: 'Av. Central 456, Condominio Los Álamos' })
  @IsNotEmpty()
  @IsString()
  @Length(5, 150)
  direccion: string;
}
