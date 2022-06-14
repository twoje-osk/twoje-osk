import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { UserMyProfileResponseDto } from '@osk/shared';
import { CurrentUserService } from 'current-user/current-user.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Get('me')
  @ApiResponse({
    type: UserMyProfileResponseDto,
  })
  async findMyProfile(): Promise<UserMyProfileResponseDto> {
    const currentUserId = this.currentUserService.getRequestCurrentUser();
    const user = await this.usersService.findOneById(currentUserId.userId);

    if (user === null) {
      throw new NotFoundException();
    }

    return { user };
  }
}
