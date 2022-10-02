import { Injectable } from '@nestjs/common';
import { EmailOptions, MailgunService } from '@nextnm/nestjs-mailgun';
import { CustomConfigService } from 'config/config.service';
import { EmailContents } from './mail.types';

@Injectable()
export class MailService {
  constructor(
    private mailgunService: MailgunService,
    private configService: CustomConfigService,
  ) {}

  public sendEmail(to: string, subject: string, contents: EmailContents) {
    const domain = this.configService.get('mailgun.domain');

    const options: EmailOptions = {
      from: `noreply@${domain}`,
      to,
      subject,
      text: contents.text,
      html: contents.html,
    };

    return this.mailgunService.createEmail(domain, options);
  }
}
