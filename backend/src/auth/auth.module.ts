import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigService } from 'config/config.service';
import { CustomConfigModule } from 'config/config.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    CustomConfigModule,
    JwtModule.registerAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: CustomConfigService) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '1 day' },
      }),
      inject: [CustomConfigService],
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
