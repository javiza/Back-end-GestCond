import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { RegistrosIngresosService } from './registros-ingreso.service';
import { RegistrosIngresosController } from './registros-ingreso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroIngreso])],
  controllers: [RegistrosIngresosController],
  providers: [RegistrosIngresosService],
})
export class RegistrosIngresosModule {}
