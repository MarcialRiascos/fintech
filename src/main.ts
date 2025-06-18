import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common'; // <-- Asegúrate de importar esto
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
