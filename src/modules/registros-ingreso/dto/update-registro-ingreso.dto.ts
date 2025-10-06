import { IsOptional, IsDateString } from 'class-validator';

export class UpdateRegistroIngresoDto {
  @IsOptional() @IsDateString() fecha_hora_salida?: string;
}
