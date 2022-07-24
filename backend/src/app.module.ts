import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { InstructorsModule } from 'instructors/instructors.module';
import { OrganizationDomainMiddleware } from 'organization-domain/organization-domain.middleware';
import { OrganizationDomainModule } from 'organization-domain/organization-domain.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'common/guards/roles.guard';
import { JwtAuthGuard } from 'auth/passport/jwt-auth.guard';
import { DriversLicenseCategoriesModule } from 'driversLicenseCategory/driversLicenseCategory.module';
import { getConfiguration, NestConfiguration } from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { TraineesModule } from './trainees/trainees.module';
import { CurrentUserModule } from './current-user/current-user.module';
import { DebugModule } from './debug/debug.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AvailabilityModule } from './availability/availability.module';
import { LessonsModule } from './lessons/lessons.module';

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
    LessonsModule,
    AvailabilityModule,
    DriversLicenseCategoriesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OrganizationDomainMiddleware).forRoutes('*');
  }
}
