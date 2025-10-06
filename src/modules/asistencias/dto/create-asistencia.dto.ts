import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAsistenciaDto {
  @IsInt() @Type(() => Number) id_personal: number;
  @IsOptional() @IsString() fecha?: string; // YYYY-MM-DD
  @IsOptional() @IsString() hora_entrada?: string; // HH:MM:SS
  @IsOptional() @IsString() hora_salida?: string; // HH:MM:SS
  @IsOptional() @IsString() observacion?: string;
}
