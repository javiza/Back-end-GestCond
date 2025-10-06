import { IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNoAutorizadoDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsOptional() @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/) rut?: string;
  @IsOptional() @IsInt() @Type(() => Number) id_casa?: number;
  @IsOptional() @IsString() motivo?: string;
  @IsInt() @Type(() => Number) id_guardia: number;
}
