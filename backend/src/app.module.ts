import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { APP_GUARD } from '@nestjs/core';
import { RequestContextModule } from 'nestjs-request-context';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { TraineesModule } from './trainees/trainees.module';
import { CurrentUserModule } from './current-user/current-user.module';
import { DebugModule } from './debug/debug.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AvailabilityModule } from './availability/availability.module';
import { LessonsModule } from './lessons/lessons.module';
import { MailModule } from './mail/mail.module';
import { CustomConfigModule } from './config/config.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { AnnouncementsModule } from './announcements/announcement.module';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { CustomConfigService } from './config/config.service';
import { DefaultAvailabilityModule } from './defaultAvailability/defaultAvailability.module';
import { DriversLicenseCategoriesModule } from './driversLicenseCategory/driversLicenseCategory.module';
import { InstructorsModule } from './instructors/instructors.module';
import { OrganizationDomainMiddleware } from './organization-domain/organization-domain.middleware';
import { OrganizationDomainModule } from './organization-domain/organization-domain.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (configService: CustomConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          schema: configService.get('database.schema'),
          entities: ['**/*.entity.js'],
          migrations: ['dist/src/migrations/*.js'],
          synchronize: false,
          migrationsRun: configService.get('isProduction'),
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
    }),
    AuthModule,
    AnnouncementsModule,
    UsersModule,
    TraineesModule,
    InstructorsModule,
    CurrentUserModule,
    DebugModule,
    VehiclesModule,
    OrganizationsModule,
    OrganizationDomainModule,
    LessonsModule,
    AvailabilityModule,
    DefaultAvailabilityModule,
    DriversLicenseCategoriesModule,
    MailModule,
    CustomConfigModule,
    ResetPasswordModule,
    RequestContextModule,
    PaymentsModule,
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
