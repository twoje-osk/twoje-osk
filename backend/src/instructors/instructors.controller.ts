import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  InstructorFindAllResponseDto,
  InstructorFindOneResponseDto,
  InstructorUpdateRequestDto,
  InstructorUpdateResponseDto,
  UserRole,
} from '@osk/shared';
import { assertNever } from 'utils/assertNever';
import { Roles } from 'common/guards/roles.decorator';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
@Roles(UserRole.Admin)
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

  @ApiResponse({
    type: InstructorFindAllResponseDto,
  })
  @Get()
  async findAll(): Promise<InstructorFindAllResponseDto> {
    const instructors = await this.instructorsService.findAll();

    return { instructors };
  }

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
    type: InstructorUpdateResponseDto,
  })
  @Patch(':id')
  async update(
    @Body() { instructor }: InstructorUpdateRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructorUpdateResponseDto> {
    const updateResult = await this.instructorsService.update(instructor, id);
    if (updateResult.ok === true) {
      return { instructor: updateResult.data };
    }
    if (updateResult.error === 'EMAIL_ALREADY_TAKEN') {
      throw new ConflictException('This email address has been already taken');
    }
    if (updateResult.error === 'NO_SUCH_INSTRUCTOR') {
      throw new NotFoundException('There is no instructor with this id');
    }
    return assertNever(updateResult.error);
  }
}
