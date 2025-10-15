import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Integrante } from './integrante.entity';
import { IntegrantesService } from './integrantes.service';
import { IntegrantesController } from './integrantes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Integrante])],
  providers: [IntegrantesService],
  controllers: [IntegrantesController],
  exports: [IntegrantesService],
})
export class IntegrantesModule {}
