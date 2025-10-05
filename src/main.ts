import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Habilitar CORS para el frontend
  app.enableCors({
    origin: [
      'http://localhost:4200',
      'http://localhost:8100',
      'https://gest-cond.onrender.com'
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Configuración Swagger
  const config = new DocumentBuilder()
    .setTitle('Gestión Ropería Clínica API')
    .setDescription('Documentación de la API para gestión de prendas hospitalarias')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

   const PORT = process.env.PORT || 3000; 
  await app.listen(PORT);
}
bootstrap();

