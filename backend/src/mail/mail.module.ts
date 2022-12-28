import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailgunModule } from '@nextnm/nestjs-mailgun';
import { CustomConfigService } from '../config/config.service';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailgunModule.forAsyncRoot({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: CustomConfigService) => ({
        username: 'noreply',
        key: configService.get('mailgun.apiKey') ?? 'dummy-key',
        url: configService.get('mailgun.apiDomain'),
      }),
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
