import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfiguration, NestConfiguration } from './config/configuration';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

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
          migrations: ['migrations/*.js', 'seeds/*.js'],
          synchronize: false,
          migrationsRun: configService.get('isProduction'),
        };
      },
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
