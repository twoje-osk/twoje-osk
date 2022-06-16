import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import {
  UserMyProfileResponseDto,
  UserAddNewResponseDto,
  UserAddNewRequestDto,
} from '@osk/shared';
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

  @ApiCreatedResponse({
    type: UserAddNewResponseDto,
    description: 'Record created',
  })
  @ApiBody({ type: UserAddNewRequestDto })
  @Post()
  async create(
    @Body() { user }: UserAddNewRequestDto,
  ): Promise<UserAddNewResponseDto> {
    const doesUserExist = await this.usersService.findOneByEmail(user.email);

    if (doesUserExist) {
      throw new ConflictException('An user with this email already exist.');
    }

    return {
      user: await this.usersService.create(
        user.email,
        user.password,
        user.firstName,
        user.lastName,
        user.isActive,
        user.createdAt,
        user.phoneNumber,
      ),
    };
  }
}
