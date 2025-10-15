import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Casa } from './casa.entity';
import { CasasService } from './casas.service';
import { CasasController } from './casas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Casa])],
  controllers: [CasasController],
  providers: [CasasService],
  exports: [CasasService],
})
export class CasasModule {}
