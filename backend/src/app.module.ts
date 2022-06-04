import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InstructorsModule } from 'instructors/instructors.module';
import { OrganizationDomainModule } from 'organization-domain/organization-domain.module';
import { OrganizationExistsGuard } from 'organization-domain/guards/organization-exists.guard';
import { APP_GUARD } from '@nestjs/core';
import { getConfiguration, NestConfiguration } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { TraineesModule } from './trainees/trainees.module';
import { CurrentUserModule } from './current-user/current-user.module';
import { DebugModule } from './debug/debug.module';
import { VehiclesModule } from './vehicles/vehicles.module';

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
          entities: ['**/*.entity.js'],
          migrations: ['dist/migrations/*.js'],
          synchronize: false,
          migrationsRun: configService.get('isProduction'),
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    AuthModule,
    UsersModule,
    OrganizationsModule,
    TraineesModule,
    InstructorsModule,
    CurrentUserModule,
    DebugModule,
    VehiclesModule,
    OrganizationsModule,
    OrganizationDomainModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: OrganizationExistsGuard,
    },
  ],
})
export class AppModule {}
