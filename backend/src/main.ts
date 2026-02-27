import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // remueve propiedades no declaradas en el DTO
    forbidNonWhitelisted: true, // arroja error si llegan campos no permitidos
    transform: true, // transforma los payloads casteando tipos de ser necesario
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
