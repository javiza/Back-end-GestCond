import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './vehiculo.entity';
import { VehiculosService } from './vehiculos.service';
import { VehiculosController } from './vehiculos.controller';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Integrante } from '../integrantes/integrante.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo, Casa, Usuario, Integrante])],
  controllers: [VehiculosController],
  providers: [VehiculosService],
  exports: [VehiculosService],
})
export class VehiculosModule {}
