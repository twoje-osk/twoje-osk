import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomConfigService } from './config.service';
import { getConfiguration } from './configuration';

@Global()
@Module({
  providers: [CustomConfigService],
  exports: [CustomConfigService],
  imports: [
    ConfigModule.forRoot({
      load: [getConfiguration],
    }),
  ],
})
export class CustomConfigModule {}
