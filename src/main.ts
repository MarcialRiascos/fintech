import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // <-- Asegúrate de importar esto
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const uploadsPath = path.join(__dirname, '..', 'public', 'uploads');

  // Crear la carpeta si no existe
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Servir imágenes de tiendas
  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public/', // esto hará que se pueda acceder con /public/uploads/imagen.jpg
  });

  app.setGlobalPrefix('api/v1/');

  // 🚨 Validación global para proteger tu API
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ✅ Elimina propiedades no definidas en DTO
      forbidNonWhitelisted: true, // ❌ Lanza error si envían propiedades no permitidas
      transform: true, // ✅ Convierte los tipos (por ejemplo, string a number en los DTOs)
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API FINTECH')
    .setDescription('Documentación de endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
