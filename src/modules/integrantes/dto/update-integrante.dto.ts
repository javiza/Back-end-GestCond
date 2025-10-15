import { PartialType } from '@nestjs/swagger';
import { CreateIntegranteDto } from './create-integrante.dto';

export class UpdateIntegranteDto extends PartialType(CreateIntegranteDto) {}
