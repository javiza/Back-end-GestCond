import { PartialType } from '@nestjs/swagger';
import { CreateNoAutorizadoDto } from './create-no-autorizado.dto';
export class UpdateNoAutorizadoDto extends PartialType(CreateNoAutorizadoDto) {}
