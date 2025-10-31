import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResidentesService } from './residentes.service';
import { ResidentesController } from './residentes.controller';
import { Residente } from './residente.entity';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Residente, Casa, Usuario]), //  Repositorios disponibles para el servicio
  ],
  controllers: [ResidentesController],
  providers: [ResidentesService],
  exports: [ResidentesService], // (opcional) por si se usa en otros módulos
})
export class ResidentesModule {}
