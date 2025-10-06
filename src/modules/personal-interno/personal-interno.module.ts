import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalInterno } from './personal-interno.entity';
import { PersonalInternoService } from './personal-interno.service';
import { PersonalInternoController } from './personal-interno.controller';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PersonalInterno, EmpresaContratista, Usuario])],
  controllers: [PersonalInternoController],
  providers: [PersonalInternoService],
  exports: [PersonalInternoService],
})
export class PersonalInternoModule {}
