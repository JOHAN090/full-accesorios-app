import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SpanishExceptionFilter } from './common/filters/spanish-exception.filter';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors({
    origin: true, // Permite cualquier origen (localhost o Render)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Prefijo global para las rutas
  app.setGlobalPrefix('api');

  // Filtro global de excepciones - Mensajes de error en español
  app.useGlobalFilters(new SpanishExceptionFilter());

  // Pipe global de validación con mensajes en español
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Crear directorio de uploads si no existe
  const uploadsDir = join(__dirname, '..', 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 FULL Accesorios Backend running on: http://localhost:${port}/api`);
}
bootstrap();
