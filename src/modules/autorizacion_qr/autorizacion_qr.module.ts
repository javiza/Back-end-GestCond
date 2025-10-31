import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AutorizacionQR } from './autorizacion_qr.entity';
import { AutorizacionQRService } from './autorizacion_qr.service';
import { AutorizacionQRController } from './autorizacion_qr.controller';
import { Usuario } from '../usuarios/usuarios.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([AutorizacionQR, Usuario]),
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'autorizacion-qr-service',
            brokers: ['localhost:9092'], // o la URL de tu clúster Kafka
          },
          consumer: {
            groupId: 'autorizacion-qr-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [AutorizacionQRController],
  providers: [AutorizacionQRService],
  exports: [AutorizacionQRService],
})
export class AutorizacionQRModule {}