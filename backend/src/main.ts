import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';
import { AppModule } from './app.module';
import { CustomConfigService } from './config/config.service';

async function bootstrap() {
  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create(AppModule);
  const configService: CustomConfigService = app.get(CustomConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');

  if (!configService.get('isProduction')) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Twoje OSK API')
      .setVersion('1.0')
      .addBearerAuth()
      .addSecurityRequirements('bearer', [])
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/swagger', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        tryItOutEnabled: true,
      },
    });
  }

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const port = configService.get('port');

  await app.listen(port, '0.0.0.0');

  Logger.log(`NestJS app running on http://localhost:${port}/api`);
}
bootstrap();
