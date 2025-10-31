import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './vehiculo.entity';
import { VehiculosService } from './vehiculo.service';
import { VehiculosController } from './vehiculo.controller';
import { Casa } from '../casas/casa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo, Casa])],
  providers: [VehiculosService],
  controllers: [VehiculosController],
  exports: [VehiculosService],
})
export class VehiculosModule {}
