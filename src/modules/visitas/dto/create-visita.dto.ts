import { IsInt, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVisitaDto {
  @IsString() @IsNotEmpty() nombre: string;
  @IsString() @Matches(/^[0-9]{1,2}\.?[0-9]{3}\.?[0-9]{3}-[0-9kK]$/) rut: string;
  @IsInt() @Type(() => Number) id_casa: number;
  @IsInt() @Type(() => Number) autorizado_por: number;
  @IsString() @IsNotEmpty() codigo_qr: string;
}
