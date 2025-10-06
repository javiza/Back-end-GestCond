import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehiculoDto {
  @IsString() @IsNotEmpty()
  @Matches(/^[A-Z0-9-]{5,10}$/)
  patente: string;

  @IsOptional() @IsString() marca?: string;
  @IsOptional() @IsString() modelo?: string;
  @IsOptional() @IsString() color?: string;

  @IsOptional() @IsIn(['locatario','integrante'])
  tipo_propietario?: 'locatario' | 'integrante';

  @IsInt() @Type(() => Number)
  id_casa: number;

  @IsInt() @Type(() => Number)
  id_locatario: number;

  @IsOptional() @Type(() => Number)
  id_integrante?: number;
}
