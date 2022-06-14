import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestConfiguration } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<NestConfiguration> =
    app.get(ConfigService);

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
