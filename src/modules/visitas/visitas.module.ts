import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visita } from './visita.entity';
import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visita, Casa, Usuario])],
  controllers: [VisitasController],
  providers: [VisitasService],
  exports: [VisitasService],
})
export class VisitasModule {}
