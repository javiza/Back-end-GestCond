import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { Usuario } from './usuarios.entity';
import { Guardia } from '../guardias/guardia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario,Guardia])],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule {}
