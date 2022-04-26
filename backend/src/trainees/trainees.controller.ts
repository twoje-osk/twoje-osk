import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import {
  TraineeFindAllResponseDto,
  TraineeFindOneResponseDto,
} from '@osk/shared';
import { TraineesService } from './trainees.service';

@Controller('trainees')
export class TraineesController {
  constructor(private readonly traineesService: TraineesService) {}

  @ApiResponse({
    type: TraineeFindAllResponseDto,
  })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    const trainees = await this.traineesService.findAll();

    return { trainees };
  }

  @ApiResponse({
    type: TraineeFindOneResponseDto,
  })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<TraineeFindOneResponseDto> {
    const trainee = await this.traineesService.findOne(+id);

    if (trainee === null) {
      throw new NotFoundException();
    }

    return { trainee };
  }
}
