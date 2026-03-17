import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { ValidationPipe, INestApplication } from '@nestjs/common';
import type { Express } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';

let cachedApp: Express | null = null;

async function getApp(): Promise<Express> {
  if (!cachedApp) {
    const app: INestApplication = await NestFactory.create(AppModule, {
      logger: ['error', 'warn'],
    });

    app.enableCors();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    cachedApp = app.getHttpAdapter().getInstance() as Express;
  }
  return cachedApp;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const expressApp = await getApp();
  expressApp(req as any, res as any);
}
