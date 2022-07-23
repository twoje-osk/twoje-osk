import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import AdminJS from 'adminjs';
import '@adminjs/express';
import { AdminModule } from '@adminjs/nestjs';
import { Database, Resource } from '@adminjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

// Adding `@ts-ignore` so that it doesn't throw an error when the admin entities aren't built
// @ts-ignore
import { resources } from 'admin/admin.imports';
import { optionsWithAuth, withCustomResourceOptions } from 'admin/admin.utils';
import { RESOURCE_OVERRIDES } from 'admin/admin.constants';
import { FAVICON, LOGO } from 'admin/admin.assets';
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
          entities: ['**/*.entity.admin.js'],
        };
      },
    }),
    AdminModule.createAdminAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<NestConfiguration, true>) => {
        return optionsWithAuth(
          configService.get('adminDisableAuth'),
          configService.get('adminCookieSecret'),
        )({
          adminJsOptions: {
            rootPath: '/',
            resources: withCustomResourceOptions(resources, RESOURCE_OVERRIDES),
            branding: {
              companyName: 'Super Admin Panel | Twoje OSK',
              logo: LOGO,
              withMadeWithLove: false,
              favicon: FAVICON,
            },
          },
        });
      },
    }),
  ],
})
export class AppModule {}

async function bootstrap() {
  AdminJS.registerAdapter({ Database, Resource });

  const app = await NestFactory.create(AppModule);
  const configService: ConfigService<NestConfiguration> =
    app.get(ConfigService);

  const port = configService.get('adminPort');

  await app.listen(port, '0.0.0.0');

  Logger.log(`Admin app running on http://localhost:${port}`);
}
bootstrap();
