import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { AuthModule } from './modules/auth/auth.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { VehiculosModule } from './modules/vehiculo/vehiculo.module';
import { RondasModule } from './modules/ronda/ronda.module';
import { CasasModule } from './modules/casas/casas.module';
import { RegistrosIngresosModule } from './modules/registros-ingreso/registros-ingreso.module';
import { PersonalInternoModule } from './modules/personal-interno/personal-interno.module';
import { EmpresasContratistasModule } from './modules/empresas-contratistas/empresas-contratistas.module';
import { KafkaModule } from './kafka/kafka.module';
import { AutorizacionQRModule } from './modules/autorizacion_qr/autorizacion_qr.module';
import { GuardiasModule } from './modules/guardias/guardias.module';
import { ResidentesModule } from './modules/residentes/residentes.module';
import { TurnosModule } from './modules/turnos/turnos.module';
import { TrabajosModule } from './modules/trabajos/trabajos.module';
import 'typeorm/driver/postgres/PostgresDriver';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Conexión PostgreSQL
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'jona',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'condominio6',
      autoLoadEntities: true,
      synchronize: false,
      logging: false,
    }),

    //  Kafka (opcional)
    ...(process.env.USE_KAFKA === 'true' ? [KafkaModule] : []),

    // Módulos funcionales
    UsuariosModule,
    AuthModule,
    AnalyticsModule,
   TrabajosModule,
    VehiculosModule,
    RondasModule,
    CasasModule,
    RegistrosIngresosModule,
    PersonalInternoModule,
    EmpresasContratistasModule,
    AuditoriaModule,
    AutorizacionQRModule,
    GuardiasModule,
    ResidentesModule,
    TurnosModule,
  ],
})
export class AppModule {}
