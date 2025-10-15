import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { LocatariosModule } from './modules/locatarios/locatarios.module';
import { VehiculosModule } from './modules/vehiculo/vehiculo.module';
import { IntegrantesModule } from './modules/integrantes/integrantes.module';
import { RondasModule } from './modules/ronda/ronda.module';
import { CasasModule } from './modules/casas/casas.module';
import { RegistrosIngresosModule } from './modules/registros-ingreso/registros-ingreso.module';
import { ObservacionesModule } from './modules/observaciones/observaciones.module';
import { VisitasModule } from './modules/visitas/visitas.module';
import { PersonalInternoModule } from './modules/personal-interno/personal-interno.module';
import { EmpresasContratistasModule } from './modules/empresas-contratistas/empresas-contratistas.module';    
//IMPORTA el driver para forzar carga
import 'typeorm/driver/postgres/PostgresDriver';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'jona',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'condominio1',
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    }),

    UsuariosModule,
    AuthModule,
    AnalyticsModule,
    LocatariosModule,
    VehiculosModule,
    IntegrantesModule,
    RondasModule,
    CasasModule,
    RegistrosIngresosModule,
    ObservacionesModule,
    VisitasModule,
    PersonalInternoModule,
    EmpresasContratistasModule, 
    AuditoriaModule,
  ],
})
export class AppModule {}
