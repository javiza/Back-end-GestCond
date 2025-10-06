import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpresaContratista } from './empresa-contratista.entity';
import { EmpresasContratistasService } from './empresas-contratistas.service';
import { EmpresasContratistasController } from './empresas-contratistas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([EmpresaContratista])],
  controllers: [EmpresasContratistasController],
  providers: [EmpresasContratistasService],
  exports: [EmpresasContratistasService],
})
export class EmpresasContratistasModule {}
