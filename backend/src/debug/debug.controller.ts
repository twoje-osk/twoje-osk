// eslint-disable-next-line max-classes-per-file
import { Controller, Get, Headers } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { SkipAuth } from 'auth/passport/skip-auth.guard';

class GetHostNameResponseDto {
  @ApiProperty()
  public hostname: string;
}

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
