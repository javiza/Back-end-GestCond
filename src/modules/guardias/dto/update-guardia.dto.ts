import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateGuardiaDto } from './create-guardia.dto';
import { IsOptional, IsBoolean } from 'class-validator';

//DTO para actualizar los datos de un guardia existente en el sistema del condominio.
export class UpdateGuardiaDto extends PartialType(CreateGuardiaDto) {
  @ApiPropertyOptional({
    example: true,
    description: 'Indica si el guardia sigue activo en el sistema.',
  })
  @IsOptional()
  @IsBoolean({ message: 'El campo "activo" debe ser un valor booleano (true o false).' })
  activo?: boolean;
}
