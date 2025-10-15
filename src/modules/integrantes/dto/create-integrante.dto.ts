import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateIntegranteDto {
  @ApiProperty({ example: 'María López' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Hija' })
  @IsNotEmpty()
  @IsString()
  parentesco: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id_locatario: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  id_casa: number;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @IsInt()
  id_vehiculo?: number;
}
