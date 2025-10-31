import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ronda } from './ronda.entity';
import { RondasService } from './ronda.service';
import { RondasController } from './ronda.controller';
import { Turno } from '../turnos/turno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ronda, Turno])],
  controllers: [RondasController],
  providers: [RondasService],
  exports: [RondasService],
})
export class RondasModule {}
