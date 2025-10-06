import { IsInt, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRegistroIngresoDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  id_visita?: number;

  @IsInt()
  @Type(() => Number)
  id_guardia: number;
}
