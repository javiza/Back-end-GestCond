import { PartialType } from '@nestjs/swagger';
import { CreateRegistroIngresosAdminDto } from './create-registro-ingresos-admin.dto';

export class UpdateRegistroIngresosAdminDto extends PartialType(CreateRegistroIngresosAdminDto) {}
