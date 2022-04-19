import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfiguration } from './config/configuration';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

export const TYPEORM_ENTITIES = [User];

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          username: configService.get('database.user'),
          password: configService.get('database.password'),
          database: configService.get('database.database'),
          schema: configService.get('database.schema'),
          entities: ['dist/**/*.entity.js'],
          synchronize: false,
        };
      },
    }),
    UserModule,
  ],
})
export class AppModule {}
