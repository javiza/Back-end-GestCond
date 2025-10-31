import { PartialType } from '@nestjs/swagger';
import { CreateEmpresaContratistaDto } from './create-empresa-contratista.dto';
import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

//DTO para actualizar los datos de una empresa contratista existente en el sistema del condominio.
export class UpdateEmpresaContratistaDto extends PartialType(CreateEmpresaContratistaDto) {
  @ApiPropertyOptional({
    example: true,
    description:
      'Indica si la empresa contratista sigue activa en el sistema (true = activa, false = desactivada)',
  })
  @IsOptional()
  @IsBoolean({ message: 'El valor de activa debe ser booleano (true o false)' })
  activa?: boolean;
}
