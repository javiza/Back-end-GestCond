import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Asistencia } from './asistencia.entity';
import { AsistenciasService } from './asistencias.service';
import { AsistenciasController } from './asistencias.controller';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Asistencia, PersonalInterno])],
  controllers: [AsistenciasController],
  providers: [AsistenciasService],
  exports: [AsistenciasService],
})
export class AsistenciasModule {}
