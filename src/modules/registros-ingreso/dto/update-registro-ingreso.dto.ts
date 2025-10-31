import { PartialType } from '@nestjs/swagger';
import { CreateRegistroIngresoDto } from './create-registro_ingreso.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsDate } from 'class-validator';

export class UpdateRegistroIngresoDto extends PartialType(CreateRegistroIngresoDto) {
  @ApiPropertyOptional({
    example: '2025-10-31T23:00:00Z',
    description: 'Fecha y hora de salida del visitante (se registra al salir)',
  })
  @IsOptional()
  @IsDate({ message: 'La fecha_hora_salida debe tener un formato de fecha válido' })
  fecha_hora_salida?: Date;
}
