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
  Query,
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
  InstructorFindAllQueryDto,
} from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { assertNever } from '../utils/assertNever';

import { InstructorsService } from './instructors.service';

@Controller('instructors')
@Roles(UserRole.Admin, UserRole.Instructor)
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @Roles(UserRole.Admin, UserRole.Trainee, UserRole.Instructor)
  @ApiResponse({
    type: InstructorFindAllResponseDto,
  })
  @Get()
  async findAll(
    @Query() query: InstructorFindAllQueryDto,
  ): Promise<InstructorFindAllResponseDto> {
    const { instructors, count } = await this.instructorsService.findAll({
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
      },
      sort: {
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
      filter: query.filters ?? {},
    });

    return { instructors, total: count };
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

  @Roles(UserRole.Admin)
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

  @Roles(UserRole.Admin)
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
