import { Module } from '@nestjs/common';
import { RegistroIngresosAdminService } from './registro-ingresos-admin.service';
import { RegistroIngresosAdminController } from './registro-ingresos-admin.controller';
import { Guardia } from '../guardias/guardia.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroIngreso } from '../registros-ingreso/registro-ingreso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroIngreso, Guardia])],
  controllers: [RegistroIngresosAdminController],
  providers: [RegistroIngresosAdminService],
})
export class RegistroIngresosAdminModule {}
