import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { Guardia } from '../guardias/guardia.entity'; 
import { RegistrosIngresosService } from './registros-ingreso.service';
import { RegistrosIngresosController } from './registros-ingreso.controller';
import { RegistrosConsumer } from './registros-consumer';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroIngreso, Guardia])], 
  controllers: [RegistrosIngresosController],
  providers: [RegistrosIngresosService, RegistrosConsumer],
})
export class RegistrosIngresosModule {}
