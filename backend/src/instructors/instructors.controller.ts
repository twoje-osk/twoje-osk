import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  InstructorFindAllResponseDto,
  InstructorFindOneResponseDto,
  UserRole,
} from '@osk/shared';
import { AuthRequest } from 'auth/auth.types';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
export class InstructorsController {
  constructor(private readonly instructorsService: InstructorsService) {}

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

  @ApiResponse({
    type: InstructorFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructorFindOneResponseDto> {
    const instructor = await this.instructorsService.findOne(+id);

    console.log(instructor);

    if (instructor === null) {
      throw new NotFoundException();
    }

    return { instructor };
  }
}
