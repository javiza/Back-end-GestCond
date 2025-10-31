import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // Inicialización principal de NestJS (HTTP)
  const app = await NestFactory.create(AppModule);

  // Filtro global de excepciones HTTP
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // CORS para el frontend Angular/Ionic
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:8100',
      'https://gest-cond.onrender.com',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Swagger API Docs
  const config = new DocumentBuilder()
    .setTitle('Gestión Condominio Habitacional API')
    .setDescription(
      'API REST para la administración de condominios, control de acceso y gestión de seguridad.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Integración condicional con Kafka (solo si USE_KAFKA=true)
  if (process.env.USE_KAFKA === 'true') {
    console.log(' Inicializando microservicio Kafka...');

    const kafkaBroker = process.env.KAFKA_BROKER || 'localhost:9092';
    const kafkaGroupId = process.env.KAFKA_GROUP_ID || 'condominio-consumer';

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [kafkaBroker],
        },
        consumer: {
          groupId: kafkaGroupId,
        },
      },
    });

    await app.startAllMicroservices();
    console.log(` Kafka conectado a broker ${kafkaBroker} (grupo: ${kafkaGroupId})`);
  } else {
    console.log(' Kafka deshabilitado (USE_KAFKA=false). Solo API REST iniciada.');
  }

  // Levantar servidor HTTP principal
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Servidor HTTP corriendo en puerto ${PORT}`);
  console.log(`Swagger disponible en: http://localhost:${PORT}/api`);
}

bootstrap();
