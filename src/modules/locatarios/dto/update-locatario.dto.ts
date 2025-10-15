import { PartialType } from '@nestjs/mapped-types';
import { CreateLocatarioDto } from './create-locatario.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, MinLength, Matches } from 'class-validator';

export class UpdateLocatarioDto extends PartialType(CreateLocatarioDto) {
  @ApiPropertyOptional({ example: 2 })
  @IsOptional() @IsInt() @Min(1)
  id_casa?: number;

  @ApiPropertyOptional({ minLength: 8 })
  @IsOptional()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/)
  password?: string;
}