import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Importe o ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  // 2. Use o pipe globalmente na sua aplicação
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();