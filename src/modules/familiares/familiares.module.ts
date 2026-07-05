import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Familiar } from './entities/familiare.entity';

import { FamiliaresService } from './familiares.service';

import { FamiliaresController } from './familiares.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Familiar])],

  controllers: [FamiliaresController],

  providers: [FamiliaresService],

  exports: [FamiliaresService],
})
export class FamiliaresModule {}
