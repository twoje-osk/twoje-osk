import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'users/users.module';
import { MailModule } from 'mail/mail.module';
import { ResetPasswordService } from './reset-password.service';
import { ResetPasswordToken } from './entities/reset-password-token.entity';
import { ResetPasswordController } from './reset-password.controller';

@Module({
  providers: [ResetPasswordService],
  exports: [ResetPasswordService],
  imports: [
    TypeOrmModule.forFeature([ResetPasswordToken]),
    UsersModule,
    MailModule,
    ResetPasswordModule,
  ],
  controllers: [ResetPasswordController],
})
export class ResetPasswordModule {}
