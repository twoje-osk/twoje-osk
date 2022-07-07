import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  TraineeFindAllResponseDto,
  TraineeFindOneResponseDto,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { TraineesService } from './trainees.service';

@Roles(UserRole.Admin, UserRole.Instructor)
@Controller('trainees')
export class TraineesController {
  constructor(private readonly traineesService: TraineesService) {}

  @ApiResponse({
    type: TraineeFindAllResponseDto,
  })
  @Get()
  async findAll(): Promise<TraineeFindAllResponseDto> {
    const trainees = await this.traineesService.findAll();

    return { trainees };
  }

  @ApiResponse({
    type: TraineeFindOneResponseDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TraineeFindOneResponseDto> {
    const trainee = await this.traineesService.findOne(+id);

    if (trainee === null) {
      throw new NotFoundException();
    }

    return { trainee };
  }
}
