import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCasaDto {
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsInt()
  @Type(() => Number)
  id_locatario: number;
}
