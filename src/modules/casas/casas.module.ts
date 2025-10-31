import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Casa } from './casa.entity';
import { CasasService } from './casas.service';
import { CasasController } from './casas.controller';
import { Residente } from '../residentes/residente.entity';
import { Vehiculo } from '../vehiculo/vehiculo.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Casa, Residente, Vehiculo]), 
  ],
  controllers: [CasasController],
  providers: [CasasService],
  exports: [CasasService],
})
export class CasasModule {}
