import { Controller, Get, NotFoundException, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { UserTestDto } from '@osk/shared';
import { AuthRequest } from 'auth/auth.types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get('me')
  @ApiResponse({
    type: UserTestDto,
  })
  async findMyProfile(@Request() req: AuthRequest): Promise<UserTestDto> {
    const user = await this.usersService.findOneById(req.user.userId);

    if (user === null) {
      throw new NotFoundException();
    }

    return { user };
  }
}
