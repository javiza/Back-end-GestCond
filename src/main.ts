import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './common/filters/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Habilitar CORS para el frontend
app.enableCors({
  origin: ['http://localhost:4200','http://localhost:8100','https://front-end-gestad.onrender.com'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

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

