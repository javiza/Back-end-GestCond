import { IsNotEmpty, IsOptional, IsString, IsEmail } from 'class-validator';

export class CreateEmpresaContratistaDto {
  @IsNotEmpty()
  @IsString()
  nombre_encargado: string;

  @IsNotEmpty()
  @IsString()
  nombre_empresa: string;

  @IsOptional()
  @IsString()
  rubro?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
