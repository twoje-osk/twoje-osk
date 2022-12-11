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
  Request,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import {
  TraineeFindAllResponseDto,
  TraineeFindOneResponseDto,
  UserRole,
  TraineeUpdateResponseDto,
  TraineeUpdateRequestDto,
  TraineeAddNewResponseDto,
  TraineeAddNewRequestDto,
  TraineeDisableResponseDto,
  TraineeAddNewRequestSignupDto,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { assertNever } from 'utils/assertNever';
import { ResetPasswordService } from 'reset-password/reset-password.service';
import { CepikService } from 'cepik/cepik.service';
import { SkipAuth } from 'auth/passport/skip-auth.guard';
import { TraineesService } from './trainees.service';

@Roles(UserRole.Admin, UserRole.Instructor)
@Controller('trainees')
export class TraineesController {
  constructor(
    private readonly traineesService: TraineesService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly cepikService: CepikService,
  ) {}

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

  @SkipAuth()
  @ApiResponse({
    type: TraineeAddNewResponseDto,
  })
  @ApiBody({ type: TraineeAddNewRequestSignupDto })
  @Post('/signup')
  async signUp(
    @Body() { trainee }: TraineeAddNewRequestSignupDto,
  ): Promise<TraineeAddNewResponseDto> {
    const cepikData = await this.cepikService.registerUser(
      trainee.pkk,
      trainee.dateOfBirth,
    );

    if (!cepikData.ok) {
      throw new UnprocessableEntityException(
        'User with specified PKK and date of birth does not exist',
      );
    }

    const traineeWithCepikData = {
      ...trainee,
      user: {
        ...trainee.user,
        isActive: true,
        firstName: cepikData.data.firstName,
        lastName: cepikData.data.lastName,
      },
      pesel: cepikData.data.pesel,
    };

    const createTraineeCall = await this.traineesService.create(
      traineeWithCepikData,
    );

    if (createTraineeCall.ok) {
      return { trainee: createTraineeCall.data };
    }

    const { error } = createTraineeCall;

    if (error === 'TRAINEE_OR_USER_FOUND') {
      throw new ConflictException(
        'There is already a trainee which has the same pesel or a user with the same email',
      );
    }
    return assertNever(error);
  }

  @ApiResponse({
    type: TraineeAddNewResponseDto,
  })
  @ApiBody({ type: TraineeAddNewRequestDto })
  @Post()
  async create(
    @Body() { trainee }: TraineeAddNewRequestDto,
    @Request() req: ExpressRequest,
  ): Promise<TraineeAddNewResponseDto> {
    const isHttps = req.protocol === 'https';
    const createTraineeCall = await this.traineesService.create(trainee);

    if (!createTraineeCall.ok) {
      const { error } = createTraineeCall;

      if (error === 'TRAINEE_OR_USER_FOUND') {
        throw new ConflictException(
          'There is already a trainee which has the same pesel or a user with the same email',
        );
      }

      if (error === 'CEPIK_ERROR') {
        throw new UnprocessableEntityException(
          'User with specified PKK and date of birth does not exist',
        );
      }
      return assertNever(error);
    }

    const tokenResult = await this.resetPasswordService.createToken(
      createTraineeCall.data.userId,
    );
    if (tokenResult.ok) {
      this.resetPasswordService.sendResetEmail(
        createTraineeCall.data.user.email,
        tokenResult.data,
        isHttps,
      );
    }

    return { trainee: createTraineeCall.data };
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
      throw new UnprocessableEntityException(
        'Trainee with this id is already disabled.',
      );
    }
    return assertNever(error);
  }
}
