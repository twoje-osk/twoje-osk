import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  InstructorFindAllResponseDto,
  InstructorFindOneResponseDto,
  InstructorUpdateRequestDto,
  InstructorUpdateResponseDto,
  InstructorCreateRequestDto,
  InstructorCreateResponseDto,
  UserRole,
} from '@osk/shared';
import { AuthRequest } from '../auth/auth.types';
import { Roles } from '../common/guards/roles.decorator';
import { assertNever } from '../utils/assertNever';

import { InstructorsService } from './instructors.service';

@Controller('instructors')
@Roles(UserRole.Admin)
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Roles(UserRole.Admin, UserRole.Trainee, UserRole.Instructor)
  @ApiResponse({
    type: InstructorFindAllResponseDto,
  })
  @Get()
  async findAll(
    @Request() request: AuthRequest,
  ): Promise<InstructorFindAllResponseDto> {
    const { role } = request.user;
    const instructors = await this.instructorsService.findAll(
      role === UserRole.Trainee ? true : undefined,
    );

    return { instructors };
  }

  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiResponse({
    type: InstructorFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructorFindOneResponseDto> {
    const instructor = await this.instructorsService.findOne(+id);

    if (instructor === null) {
      throw new NotFoundException();
    }

    return { instructor };
  }

  @ApiResponse({
    type: InstructorCreateResponseDto,
  })
  @Post()
  async create(
    @Body() { instructor }: InstructorCreateRequestDto,
  ): Promise<InstructorCreateResponseDto> {
    const createResult = await this.instructorsService.create(instructor);
    if (createResult.ok === true) {
      return { id: createResult.data };
    }
    if (createResult.error === 'EMAIL_ALREADY_TAKEN') {
      throw new ConflictException('This email address has been already taken');
    }
    if (createResult.error === 'WRONG_CATEGORIES') {
      throw new NotFoundException(
        'Provided drivers license categories are invalid',
      );
    }
    return assertNever(createResult.error);
  }

  @ApiResponse({
    type: InstructorUpdateResponseDto,
  })
  @Patch(':id')
  async update(
    @Body() { instructor }: InstructorUpdateRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructorUpdateResponseDto> {
    const updateResult = await this.instructorsService.update(instructor, id);
    if (updateResult.ok === true) {
      return { id: updateResult.data };
    }
    if (updateResult.error === 'EMAIL_ALREADY_TAKEN') {
      throw new ConflictException('This email address has been already taken');
    }
    if (updateResult.error === 'NO_SUCH_INSTRUCTOR') {
      throw new NotFoundException('There is no instructor with this id');
    }
    if (updateResult.error === 'WRONG_CATEGORIES') {
      throw new NotFoundException(
        'Provided drivers license categories are invalid',
      );
    }
    return assertNever(updateResult.error);
  }
}
