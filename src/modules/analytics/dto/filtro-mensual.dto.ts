import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class FiltroMensualDto {
  @ApiProperty({ example: 1, description: 'Número del mes (1-12)' })
  @IsInt()
  @Min(1)
  @Max(12)
  mes: number;

  @ApiProperty({ example: 2025, description: 'Año a consultar' })
  @IsInt()
  anio: number;
}
