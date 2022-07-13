import {
  Body,
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
} from '@osk/shared';
import { InstructorsService } from './instructors.service';

@Controller('instructors')
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
    type: InstructorUpdateRequestDto,
  })
  @Patch(':id')
  async update(
    @Body() { instructor }: InstructorUpdateRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<InstructorUpdateResponseDto> {
    const updateResult = await this.instructorsService.update(instructor, id);
  }
}
