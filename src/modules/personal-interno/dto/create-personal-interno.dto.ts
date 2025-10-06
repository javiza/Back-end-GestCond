import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePersonalInternoDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @IsNotEmpty() cargo: string;
  @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/) rut: string;
  @IsOptional() @IsBoolean() empresa_externa?: boolean;
  @IsOptional() @IsInt() @Type(() => Number) id_empresa?: number;
  @IsOptional() @IsInt() @Type(() => Number) id_usuario?: number;
}
