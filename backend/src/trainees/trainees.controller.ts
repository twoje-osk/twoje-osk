import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  TraineeFindAllResponseDto,
  TraineeFindOneResponseDto,
  TraineeUpdateResponseDto,
  TraineeUpdateRequestDto,
} from '@osk/shared';
import { TraineesService } from './trainees.service';

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
    const trainee = await this.traineesService.findOneById(+id);

    if (trainee === null) {
      throw new NotFoundException();
    }

    return { trainee };
  }

  @ApiResponse({
    type: TraineeUpdateResponseDto,
  })
  @ApiBody({ type: TraineeUpdateRequestDto })
  @Patch(':id')
  async update(
    @Body() { trainee }: TraineeUpdateRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TraineeUpdateResponseDto> {
    try {
      await this.traineesService.update(trainee, id);
    } catch (error) {
      if (error instanceof Error && error.message === 'TRAINEE_NOT_FOUND') {
        throw new NotFoundException('Trainee with this id does not exist.');
      }
      throw error;
    }
    return {};
  }
}
