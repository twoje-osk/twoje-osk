import {
  Body,
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
  TraineeFindAllResponseDto,
  TraineeFindOneResponseDto,
  UserRole,
  TraineeUpdateResponseDto,
  TraineeUpdateRequestDto,
  TraineeAddNewResponseDto,
  TraineeAddNewRequestDto,
  TraineeDisableResponseDto,
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
    const trainee = await this.traineesService.findOneById(+id);

    if (trainee === null) {
      throw new NotFoundException();
    }

    return { trainee };
  }

  @ApiResponse({
    type: TraineeAddNewResponseDto,
  })
  @ApiBody({ type: TraineeAddNewRequestDto })
  @Post()
  async create(
    @Body() { trainee }: TraineeAddNewRequestDto,
  ): Promise<TraineeAddNewResponseDto> {
    try {
      return { trainee: await this.traineesService.create(trainee) };
    } catch (error) {
      if (error instanceof Error && error.message === 'TRAINEE_OR_USER_FOUND') {
        throw new NotFoundException(
          'There is already a trainee which has the same pesel or an user with the same email',
        );
      }
      throw error;
    }
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

  @ApiResponse({
    type: TraineeDisableResponseDto,
  })
  @Patch(':id/disable')
  async disable(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TraineeDisableResponseDto> {
    try {
      await this.traineesService.disable(id);
    } catch (error) {
      if (error instanceof Error && error.message === 'TRAINEE_NOT_FOUND') {
        throw new NotFoundException('Trainee with this id does not exist.');
      }
      if (
        error instanceof Error &&
        error.message === 'TRAINEE_ALREADY_DISABLED'
      ) {
        throw new NotFoundException(
          'Trainee with this id is already disabled.',
        );
      }
    }
    return {};
  }
}
