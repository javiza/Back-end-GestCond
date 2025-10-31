import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuardiasService } from './guardias.service';
import { GuardiasController } from './guardias.controller';
import { Guardia } from './guardia.entity';
import { AuthModule } from '../auth/auth.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { Usuario } from '../usuarios/usuarios.entity';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { EmpresasContratistasModule } from '../empresas-contratistas/empresas-contratistas.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Guardia, Usuario, EmpresaContratista]), 
    UsuariosModule,                      
    EmpresasContratistasModule,          
  ],
  controllers: [GuardiasController],
  providers: [GuardiasService],
  exports: [GuardiasService], 
})
export class GuardiasModule {}
