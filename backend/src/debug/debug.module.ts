import { Module } from '@nestjs/common';
import { MailModule } from 'mail/mail.module';
import { DebugController } from './debug.controller';

@Module({
  controllers: [DebugController],
  imports: [MailModule],
})
export class DebugModule {}
