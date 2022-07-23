import {
  Body,
  ConflictException,
  Controller,
  Get,
  MethodNotAllowedException,
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
import { assertNever } from 'utils/assertNever';
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
    const createTraineeCall = await this.traineesService.create(trainee);

    if (createTraineeCall.ok) {
      return { trainee: createTraineeCall.data };
    }

    const { error } = createTraineeCall;

    if (error === 'TRAINEE_OR_USER_FOUND') {
      throw new ConflictException(
        'There is already a trainee which has the same pesel or an user with the same email',
      );
    }
    return assertNever(error);
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
    const updateTraineeCall = await this.traineesService.update(trainee, id);

    if (updateTraineeCall.ok) {
      return { trainee: updateTraineeCall.data };
    }

    const { error } = updateTraineeCall;

    if (error === 'TRAINEE_NOT_FOUND') {
      throw new NotFoundException('Trainee with this id does not exist.');
    }
    return assertNever(error);
  }

  @ApiResponse({
    type: TraineeDisableResponseDto,
  })
  @Patch(':id/disable')
  async disable(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TraineeDisableResponseDto> {
    const disableTraineeCall = await this.traineesService.disable(id);

    if (disableTraineeCall.ok) {
      return { trainee: disableTraineeCall.data };
    }

    const { error } = disableTraineeCall;

    if (error === 'TRAINEE_NOT_FOUND') {
      throw new NotFoundException('Trainee with this id does not exist.');
    }

    if (error === 'TRAINEE_ALREADY_DISABLED') {
      throw new MethodNotAllowedException(
        'Trainee with this id is already disabled.',
      );
    }
    return assertNever(error);
  }
}
