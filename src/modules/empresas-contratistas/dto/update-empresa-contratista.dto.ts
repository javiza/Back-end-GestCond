import { PartialType } from '@nestjs/swagger';
import { CreateEmpresaContratistaDto } from './create-empresa-contratista.dto';
export class UpdateEmpresaContratistaDto extends PartialType(CreateEmpresaContratistaDto) {}
