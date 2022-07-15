import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import '@adminjs/express';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from 'organizations/entities/organization.admin';

import AdminJS from 'adminjs';

import { NestConfiguration, getConfiguration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<NestConfiguration>) => {
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          schema: configService.get('database.schema'),
          entities: [Organization],
        };
      },
    }),
    AdminModule.createAdmin({
      adminJsOptions: {
        rootPath: '/admin',
        resources: [Organization],
      },
    }),
  ],
})
export class AppModule {}

async function bootstrap() {
  AdminJS.registerAdapter({ Database, Resource });

  initializeTransactionalContext();
  patchTypeORMRepositoryWithBaseRepository();

  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<NestConfiguration> =
    app.get(ConfigService);

  const port = configService.get('port');

  await app.listen(port, '0.0.0.0');

  Logger.log(`Admin app running on http://localhost:${port}/admin`);
}
bootstrap();
