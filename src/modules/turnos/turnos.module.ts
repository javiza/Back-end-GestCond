import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Turno } from './turno.entity';
import { Guardia } from '../guardias/guardia.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Turno, Guardia]), 
  ],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],  
})
export class TurnosModule {}
