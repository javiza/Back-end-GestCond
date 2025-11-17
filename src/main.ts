import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  // === Zona horaria Chile ===
  process.env.TZ = 'America/Santiago';

  // === Manejo global de errores fuera del control de Nest ===
  process.on('unhandledRejection', (reason) => {
    console.error(' Unhandled Promise Rejection:', reason);
  });

  process.on('uncaughtException', (error) => {
    console.error(' Uncaught Exception:', error);
  });

  const app = await NestFactory.create(AppModule);

  // === CORS para Front y WebSockets ===
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:8100',
      'https://front-end-gestcond.onrender.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // === Adaptador WebSocket ===
  app.useWebSocketAdapter(new IoAdapter(app));

  // === Filtro Global de Excepciones HTTP ===
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // === Documentación Swagger ===
  const config = new DocumentBuilder()
    .setTitle('Gestión Condominio Habitacional API')
    .setDescription('API REST para la administración del condominio.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // === Shutdown Hooks (Render a veces congela procesos) ===
  app.enableShutdownHooks();

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  console.log(`Servidor HTTP corriendo en puerto ${PORT}`);
  console.log(`Swagger disponible en: http://localhost:${PORT}/api`);
}

bootstrap();
