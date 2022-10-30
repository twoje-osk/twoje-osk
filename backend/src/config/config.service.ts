import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestConfiguration } from './configuration';

@Injectable()
export class CustomConfigService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(private configService: ConfigService<NestConfiguration>) {}

  public get<T extends keyof NestConfiguration>(key: T) {
    return this.configService.get(key) as NestConfiguration[T];
  }
}
