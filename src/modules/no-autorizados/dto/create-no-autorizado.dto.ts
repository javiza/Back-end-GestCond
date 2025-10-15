import { IsNotEmpty, IsOptional, IsString, IsInt, Matches } from 'class-validator';

export class CreateNoAutorizadoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, { message: 'RUT inválido. Ej: 12345678-9' })
  rut?: string;

  @IsOptional()
  @IsInt()
  id_casa?: number;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsInt()
  id_administrador?: number;
}
