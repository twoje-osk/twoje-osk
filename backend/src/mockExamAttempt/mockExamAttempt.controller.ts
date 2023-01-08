import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  UserRole,
  MockExamAttemptFindAllResponseDto,
  MockExamAttemptFindOneResponseDto,
  MockExamAttemptSubmitResponseDto,
  MockExamAttemptSubmitRequestDto,
} from '@osk/shared';
import { AuthRequest } from '../auth/auth.types';
import { Roles } from '../common/guards/roles.decorator';
import { assertNever } from '../utils/assertNever';
import { MockExamAttemptService } from './mockExamAttempt.service';

@Controller('exams')
@Roles(UserRole.Trainee)
export class MockExamAttemptController {
  constructor(
    private readonly mockExamAttemptService: MockExamAttemptService,
  ) {}

  @Roles(UserRole.Admin)
  @ApiResponse({
    type: MockExamAttemptFindAllResponseDto,
  })
  @Get('user/:id')
  async findAllAttemptsOfUser(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MockExamAttemptFindAllResponseDto> {
    const examAttemptsResponse =
      await this.mockExamAttemptService.findAllAttemptsOfUser(id);
    if (!examAttemptsResponse.ok) {
      throw new NotFoundException(examAttemptsResponse.error);
    }
    return { examAttempts: examAttemptsResponse.data };
  }

  @ApiResponse({
    type: MockExamAttemptFindAllResponseDto,
  })
  @Get()
  async findAllMyAttempts(
    @Request() request: AuthRequest,
  ): Promise<MockExamAttemptFindAllResponseDto> {
    const { userId: id } = request.user;
    const examAttemptsResult =
      await this.mockExamAttemptService.findAllAttemptsOfUser(id);
    if (!examAttemptsResult.ok) {
      throw new NotFoundException(examAttemptsResult.error);
    }
    return { examAttempts: examAttemptsResult.data };
  }

  @ApiResponse({
    type: MockExamAttemptFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MockExamAttemptFindOneResponseDto> {
    const examAttemptResult = await this.mockExamAttemptService.findOne(id);
    if (!examAttemptResult.ok) {
      throw new NotFoundException();
    }
    return { examAttempt: examAttemptResult.data };
  }

  @ApiResponse({
    type: MockExamAttemptSubmitResponseDto,
  })
  @Post()
  async submit(
    @Body() attempt: MockExamAttemptSubmitRequestDto,
  ): Promise<MockExamAttemptSubmitResponseDto> {
    const examAttemptResponse = await this.mockExamAttemptService.submit(
      attempt,
    );
    if (examAttemptResponse.ok) {
      return { id: examAttemptResponse.data };
    }
    if (examAttemptResponse.error === 'USER_NOT_FOUND') {
      throw new NotFoundException('User does not exist');
    }
    if (examAttemptResponse.error === 'ANSWER_NOT_FOUND') {
      throw new NotFoundException(
        'At least one of the provided answers is not valid answer for given question',
      );
    }
    if (examAttemptResponse.error === 'INCORRECT_AMOUNT_OF_QUESTIONS') {
      throw new UnprocessableEntityException('Incorrect amount of questions');
    }
    if (examAttemptResponse.error === 'QUESTIONS_NOT_UNIQUE') {
      throw new UnprocessableEntityException(
        'At least one question has been provided multiple times',
      );
    }
    return assertNever(examAttemptResponse.error);
  }
}
