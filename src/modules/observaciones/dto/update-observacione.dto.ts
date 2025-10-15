import { PartialType } from '@nestjs/swagger';
import { CreateObservacionDto } from './create-observacione.dto';
export class UpdateObservacionDto extends PartialType(CreateObservacionDto) {}
