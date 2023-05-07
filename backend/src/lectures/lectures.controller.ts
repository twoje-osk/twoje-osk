import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  LectureFindAllResponseDto,
  LectureFindOneResponseDto,
  UserRole,
} from '@osk/shared';
import { Roles } from '../common/guards/roles.decorator';
import { LecturesService } from './lectures.service';

@Roles(UserRole.Trainee)
@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @ApiResponse({
    type: LectureFindAllResponseDto,
  })
  @Get()
  async findAll(): Promise<LectureFindAllResponseDto> {
    const lectures = await this.lecturesService.findAll();
    return { lectures };
  }

  @ApiResponse({
    type: LectureFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LectureFindOneResponseDto> {
    const lecture = await this.lecturesService.findOne(id);

    if (lecture === null) {
      throw new NotFoundException();
    }

    return { lecture };
  }
}
