import 'reflect-metadata';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
import { AuditoriaModule } from './modules/auditoria/auditoria.module';
import { ScheduleModule } from '@nestjs/schedule';
import { RegistroIngresosAdminModule } from './modules/registro-ingresos-admin/registro-ingresos-admin.module';
import { KeepAliveService } from './common/keepalive.service';
import { HealthController } from './common/health/health.controller';
import { HealthService } from './common/health/health.service';
import { HealthModule } from './common/health/health.module';
import { FamiliaresModule } from './modules/familiares/familiares.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
       

        //  Evita caídas y mejora reconexión con Render
        retryAttempts: 15,
        retryDelay: 3000,
        keepConnectionAlive: true,

        ssl: {
          rejectUnauthorized: false,
        },

        logging: false,
      }),
    }),

    ...(process.env.USE_KAFKA === 'true' ? [KafkaModule] : []),

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
    RegistroIngresosAdminModule,
     HealthModule,
     FamiliaresModule,
  ],
  

})
export class AppModule {}
