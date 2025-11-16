import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  process.env.TZ = 'America/Santiago';

  const app = await NestFactory.create(AppModule);

  // === ACTIVAR CORS GLOBAL PARA HTTP + WEBSOCKETS ===
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:8100',
      'https://front-end-gestcond.onrender.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // === ADAPTER CORRECTO PARA SOCKET.IO ===
  app.useWebSocketAdapter(new IoAdapter(app));

  // Filtro global
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // === Swagger ===
  const config = new DocumentBuilder()
    .setTitle('Gestión Condominio Habitacional API')
    .setDescription('API REST para la administración del condominio.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Servidor HTTP corriendo en puerto ${PORT}`);
  console.log(`Swagger disponible en: http://localhost:${PORT}/api`);
}

bootstrap();
