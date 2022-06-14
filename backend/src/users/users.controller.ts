import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Post,
  Request,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import {
  UserAddNewRequestDto,
  UserAddNewResponseDto,
  UserMyProfileResponseDto,
} from '@osk/shared';
import { AuthRequest } from 'auth/auth.types';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiResponse({
    type: UserMyProfileResponseDto,
  })
  async findMyProfile(
    @Request() req: AuthRequest,
  ): Promise<UserMyProfileResponseDto> {
    const user = await this.userService.findOneById(req.user.userId);

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
    const doesUserExist = await this.userService.findOneByEmail(user.email);

    if (doesUserExist) {
      throw new ConflictException('An user with this email already exist.');
    }

    return {
      user: await this.userService.create(
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
