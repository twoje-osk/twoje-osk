import { Controller, Get, Headers } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { SkipAuth } from '../auth/passport/skip-auth.guard';
import { GetHostNameResponseDto } from './debug.dto';

@Controller('debug')
export class DebugController {
  @SkipAuth()
  @Get('hostname')
  @ApiResponse({
    type: GetHostNameResponseDto,
  })
  getHostName(@Headers('host') hostname: string): GetHostNameResponseDto {
    return { hostname };
  }
}
