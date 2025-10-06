import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIntegranteDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() parentesco: string;

  @IsInt() @Type(() => Number) id_locatario: number;
  @IsInt() @Type(() => Number) id_casa: number;
}
