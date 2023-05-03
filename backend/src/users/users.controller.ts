import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import {
  UserMyProfileResponseDto,
  UserAddNewResponseDto,
  UserAddNewRequestDto,
  UpdateUserMyProfileRequestDto,
  UpdateUserMyProfileResponseDto,
  UserRole,
} from '@osk/shared';
import { AuthService } from '../auth/auth.service';
import { CurrentUserService } from '../current-user/current-user.service';
import { UserArguments } from '../types/UserArguments';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Get('me')
  @ApiResponse({
    type: UserMyProfileResponseDto,
  })
  async findMyProfile(): Promise<UserMyProfileResponseDto> {
    const currentUser = this.currentUserService.getRequestCurrentUser();
    const user = await this.usersService.findOneById(currentUser.userId);

    if (user === null) {
      throw new NotFoundException();
    }

    return { user };
  }

  @Patch('me')
  @ApiResponse({
    type: UpdateUserMyProfileResponseDto,
  })
  async updateMyProfile(
    @Body() body: UpdateUserMyProfileRequestDto,
  ): Promise<UpdateUserMyProfileResponseDto> {
    const currentUser = this.currentUserService.getRequestCurrentUser();
    const user = await this.usersService.findOneById(currentUser.userId);

    if (user === null) {
      throw new NotFoundException();
    }

    const shouldUpdatePassword =
      body.newPassword !== undefined && body.oldPassword !== undefined;

    if (shouldUpdatePassword) {
      const validatedUser = await this.authService.validateUserByEntity(
        user,
        body.oldPassword!,
      );

      if (validatedUser === null) {
        throw new UnprocessableEntityException('OLD_PASSWORD_INCORRECT');
      }
    }

    const baseOptions: Partial<UserArguments> = {
      email: body.email,
      phoneNumber: body.phoneNumber,
      password: shouldUpdatePassword ? body.newPassword : undefined,
    };

    const updateOptions =
      user.role === UserRole.Admin
        ? {
            ...baseOptions,
            firstName: body.firstName,
            lastName: body.lastName,
          }
        : baseOptions;

    await this.usersService.update(updateOptions, currentUser.userId);

    return {};
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
    const doesUserExist = await this.usersService.findOneByEmailFromAll(
      user.email,
    );

    if (doesUserExist) {
      throw new ConflictException('An user with this email already exist.');
    }

    return {
      user: await this.usersService.create(
        user.email,
        user.firstName,
        user.lastName,
        user.isActive,
        user.phoneNumber,
      ),
    };
  }
}
