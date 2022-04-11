import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app.listen(port, '0.0.0.0');

  Logger.log(`NestJS app running on http://localhost:${port}/api`);
}
bootstrap();
