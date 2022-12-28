import { Injectable, Logger } from '@nestjs/common';
import { EmailOptions, MailgunService } from '@nextnm/nestjs-mailgun';
import { CustomConfigService } from '../config/config.service';
import { EmailContents } from './mail.types';

@Injectable()
export class MailService {
  constructor(
    private mailgunService: MailgunService,
    private configService: CustomConfigService,
  ) {}

  public async sendEmail(
    to: string,
    subject: string,
    contents: EmailContents,
  ): Promise<void> {
    const domain = this.configService.get('mailgun.domain');

    const options: EmailOptions = {
      from: `noreply@${domain}`,
      to,
      subject,
      text: contents.text,
      html: contents.html,
    };

    if (
      this.configService.get('mailgun.apiKey') === undefined ||
      to.endsWith('@example.com')
    ) {
      Logger.debug('No Mailgun API Key. Logging email contents', options);

      return undefined;
    }

    await this.mailgunService.createEmail(domain, options);
    return undefined;
  }
}
