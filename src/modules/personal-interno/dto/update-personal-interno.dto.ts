import { PartialType } from '@nestjs/swagger';
import { CreatePersonalInternoDto } from './create-personal-interno.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdatePersonalInternoDto extends PartialType(CreatePersonalInternoDto) {
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
