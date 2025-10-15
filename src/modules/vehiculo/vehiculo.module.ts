import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehiculo } from './vehiculo.entity';
import { VehiculosService } from './vehiculo.service';
import { VehiculosController } from './vehiculo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vehiculo])],
  providers: [VehiculosService],
  controllers: [VehiculosController],
  exports: [VehiculosService],
})
export class VehiculosModule {}
