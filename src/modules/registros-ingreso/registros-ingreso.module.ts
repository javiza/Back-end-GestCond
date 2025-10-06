import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroIngreso } from './registro-ingreso.entity';
import { RegistrosIngresoService } from './registros-ingreso.service';
import { RegistrosIngresoController } from './registros-ingreso.controller';
import { Visita } from '../visitas/visita.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroIngreso, Visita, Usuario])],
  controllers: [RegistrosIngresoController],
  providers: [RegistrosIngresoService],
  exports: [RegistrosIngresoService],
})
export class RegistrosIngresoModule {}
