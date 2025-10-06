import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateEmpresaContratistaDto {
  @IsString() @IsNotEmpty() nombre_empresa: string;
  @IsOptional() @IsString() rubro?: string;
  @IsOptional() @IsString() telefono?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsBoolean() activa?: boolean;
}
