import { PartialType } from '@nestjs/swagger';
import { CreateCasaDto } from './create-casa.dto';

export class UpdateCasaDto extends PartialType(CreateCasaDto) {}
