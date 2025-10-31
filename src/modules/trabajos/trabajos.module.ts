import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajosService } from './trabajos.service';
import { TrabajosController } from './trabajos.controller';
import { Trabajo } from './trabajo.entity';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trabajo, PersonalInterno])],
  controllers: [TrabajosController],
  providers: [TrabajosService],
  exports: [TrabajosService],
})
export class TrabajosModule {}
