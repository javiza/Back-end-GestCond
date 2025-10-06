import { PartialType } from '@nestjs/swagger';
import { CreatePersonalInternoDto } from './create-personal-interno.dto';
export class UpdatePersonalInternoDto extends PartialType(CreatePersonalInternoDto) {}
