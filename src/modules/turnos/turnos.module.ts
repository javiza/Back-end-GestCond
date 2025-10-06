import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Turno } from './turno.entity';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, PersonalInterno])],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService],
})
export class TurnosModule {}
