import { Controller, Get, Headers } from '@nestjs/common';
import { SkipAuth } from 'auth/passport/skip-auth.guard';
import { DebugService } from './debug.service';

@Controller('debug')
export class DebugController {
  constructor(private readonly debugService: DebugService) {}

  @SkipAuth()
  @Get('hostname')
  getHostName(@Headers('host') hostname: string): string {
    return hostname;
  }
}
