import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { CustomConfigModule } from '../config/config.module';
import { CustomConfigService } from '../config/config.service';
import { User } from '../users/entities/user.entity';

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
