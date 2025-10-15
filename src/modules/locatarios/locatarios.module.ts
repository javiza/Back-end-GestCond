import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocatariosService } from './locatarios.service';
import { LocatariosController } from './locatarios.controller';
import { Usuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Casa])],
  controllers: [LocatariosController],
  providers: [LocatariosService],
  exports: [LocatariosService],
})
export class LocatariosModule {}
