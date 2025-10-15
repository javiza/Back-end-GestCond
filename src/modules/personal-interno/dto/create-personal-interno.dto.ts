import { IsNotEmpty, IsOptional, IsBoolean, IsInt, IsString, Matches } from 'class-validator';

export class CreatePersonalInternoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, { message: 'RUT inválido. Ej: 12345678-9' })
  rut: string;

  @IsNotEmpty()
  @IsString()
  cargo: string;

  @IsOptional()
  @IsBoolean()
  empresa_externa?: boolean;

  @IsOptional()
  @IsInt()
  id_empresa?: number;

  @IsOptional()
  @IsInt()
  id_administrador?: number;
}
