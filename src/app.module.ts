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

@Module({
  imports: [
    //  Carga variables de entorno (.env)
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    //  Conexión PostgreSQL dinámica y segura (Render compatible)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT', '5432'), 10),
        username: configService.get<string>('DB_USERNAME', ),
        password: configService.get<string>('DB_PASSWORD', ),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, // En producción mejor false
        logging: false,

        //  Render requiere SSL/TLS para conexiones externas
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),

    //  Kafka (solo si está habilitado)
    ...(process.env.USE_KAFKA === 'true' ? [KafkaModule] : []),

    //  Módulos funcionales
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
