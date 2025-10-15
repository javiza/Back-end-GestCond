import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Visita } from './visita.entity';
import { VisitasService } from './visitas.service';
import { VisitasController } from './visitas.controller';
import { Usuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Visita, Usuario, Casa])],
  controllers: [VisitasController],
  providers: [VisitasService],
  exports: [VisitasService],
})
export class VisitasModule {}
