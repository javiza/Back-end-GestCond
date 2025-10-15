import { PartialType } from '@nestjs/swagger';
import { CreateRondaDto } from './create-ronda.dto';

export class UpdateRondaDto extends PartialType(CreateRondaDto) {}
