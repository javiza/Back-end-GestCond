import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsDateString } from 'class-validator';


 //DTO de filtros para reportes analíticos.

export class FiltroAnalyticsDto {
  @ApiProperty({ example: '2025-10-01', required: false })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiProperty({ example: '2025-10-31', required: false })
  @IsOptional()
  @IsDateString()
  hasta?: string;

  @ApiProperty({ example: 'visita', required: false })
  @IsOptional()
  @IsString()
  tipo_visita?: string;

  @ApiProperty({ example: 'auto', required: false })
  @IsOptional()
  @IsString()
  tipo_vehiculo?: string;
}
