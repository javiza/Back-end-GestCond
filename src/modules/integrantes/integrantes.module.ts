import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integrante } from './integrante.entity';
import { IntegrantesService } from './integrantes.service';
import { IntegrantesController } from './integrantes.controller';
import { Usuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Integrante, Usuario, Casa])],
  controllers: [IntegrantesController],
  providers: [IntegrantesService],
  exports: [IntegrantesService],
})
export class IntegrantesModule {}
