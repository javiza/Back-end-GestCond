import { IsDateString, IsIn, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTurnoDto {
  @IsInt() @Type(() => Number) id_personal: number;
  @IsDateString() fecha_inicio: string;
  @IsDateString() fecha_fin: string;
  @IsIn(['mañana','tarde','noche','especial']) tipo_turno: 'mañana'|'tarde'|'noche'|'especial';
}
