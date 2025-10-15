import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ronda } from './ronda.entity';
import { RondasService } from './ronda.service';
import { RondasController } from './ronda.controller';
import { Usuario } from '../usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ronda, Usuario])],
  controllers: [RondasController],
  providers: [RondasService],
  exports: [RondasService],
})
export class RondasModule {}
