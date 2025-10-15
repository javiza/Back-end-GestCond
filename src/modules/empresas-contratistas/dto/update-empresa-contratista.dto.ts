import { PartialType } from '@nestjs/swagger';
import { CreateEmpresaContratistaDto } from './create-empresa-contratista.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateEmpresaContratistaDto extends PartialType(CreateEmpresaContratistaDto) {
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
