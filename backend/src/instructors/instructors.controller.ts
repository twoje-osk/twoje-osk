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
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  InstructorFindAllResponseDto,
  InstructorFindOneResponseDto,
  InstructorAddNewResponseDto,
  InstructorAddNewRequestDto,
  InstructorUpdateRequestDto,
  InstructorUpdateResponseDto,
} from '@osk/shared';
import { UsersService } from 'users/users.service';
import { InstructorsService } from './instructors.service';

const INSTRUCTOR_ALREADY_EXISTS =
  'Instructor with this email address already exists';

@Controller('instructors')
export class InstructorsController {
  constructor(
    private readonly instructorsService: InstructorsService,
    private readonly userService: UsersService,
  ) {}

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
    type: InstructorAddNewResponseDto,
    description: 'Record created',
  })
  @ApiBody({ type: InstructorAddNewRequestDto })
  @Post()
  async create(
    @Body() { instructor }: InstructorAddNewRequestDto,
  ): Promise<InstructorAddNewResponseDto> {
    const doesInstructorExist = await this.userService.checkIfExistsByEmail(
      instructor.email,
    );
    if (doesInstructorExist) {
      throw new ConflictException(INSTRUCTOR_ALREADY_EXISTS);
    }
    return {
      instructor: await this.instructorsService.create(
        instructor.firstName,
        instructor.lastName,
        instructor.email,
        instructor.phoneNumber,
      ),
    };
  }

  @ApiResponse({
    type: InstructorUpdateResponseDto,
  })
  @ApiBody({ type: InstructorUpdateRequestDto })
  @Patch(':id')
  async update(
    @Body() { instructor }: InstructorUpdateRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructorUpdateResponseDto> {
    let doesInstructorExist =
      (await this.instructorsService.findOne(id)) !== null;
    if (!doesInstructorExist) {
      throw new NotFoundException('Instructor with this id does not exist.');
    }
    if (instructor.email !== undefined) {
      doesInstructorExist = await this.userService.checkIfExistsByEmail(
        instructor.email,
      );
      if (doesInstructorExist) {
        throw new ConflictException(INSTRUCTOR_ALREADY_EXISTS);
      }
    }
    await this.instructorsService.update(instructor, id);
    return {};
  }
}
