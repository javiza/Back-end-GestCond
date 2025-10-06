import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoAutorizado } from './no-autorizado.entity';
import { NoAutorizadosService } from './no-autorizados.service';
import { NoAutorizadosController } from './no-autorizados.controller';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoAutorizado, Casa, Usuario])],
  controllers: [NoAutorizadosController],
  providers: [NoAutorizadosService],
  exports: [NoAutorizadosService],
})
export class NoAutorizadosModule {}
