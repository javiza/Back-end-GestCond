import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Observacion } from './observacione.entity';
import { ObservacionesService } from './observaciones.service';
import { ObservacionesController } from './observaciones.controller';
import { Usuario } from '../usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Observacion, Usuario])],
  controllers: [ObservacionesController],
  providers: [ObservacionesService],
  exports: [ObservacionesService],
})
export class ObservacionesModule {}
