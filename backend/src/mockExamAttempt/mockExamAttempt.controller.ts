import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
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
import { Roles } from '../common/guards/roles.decorator';
import { CurrentUserService } from '../current-user/current-user.service';
import { assertNever } from '../utils/assertNever';
import { MockExamAttemptService } from './mockExamAttempt.service';
import { MockExamQuestionService } from '../mockExamQuestion/mockExamQuestion.service';

@Controller('exams')
@Roles(UserRole.Trainee)
export class MockExamAttemptController {
  constructor(
    private readonly mockExamAttemptService: MockExamAttemptService,
    private readonly currentUserService: CurrentUserService,
    private readonly mockExamQuestionService: MockExamQuestionService,
  ) {}

  @Roles(UserRole.Admin, UserRole.Instructor)
  @ApiResponse({
    type: MockExamAttemptFindAllResponseDto,
    description: 'Returns all mock exam attempts of given user',
  })
  @Get('user/:userId')
  async findAllAttemptsOfUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<MockExamAttemptFindAllResponseDto> {
    const examAttemptsResponse =
      await this.mockExamAttemptService.findAllAttemptsOfUser(userId);
    if (!examAttemptsResponse.ok) {
      throw new NotFoundException(examAttemptsResponse.error);
    }
    return { examAttempts: examAttemptsResponse.data };
  }

  @ApiResponse({
    type: MockExamAttemptFindAllResponseDto,
    description: 'Returns all mock exam attempts of currently logged user',
  })
  @Get()
  async findAllMyAttempts(): Promise<MockExamAttemptFindAllResponseDto> {
    const { userId: id } = this.currentUserService.getRequestCurrentUser();
    const examAttemptsResult =
      await this.mockExamAttemptService.findAllAttemptsOfUser(id);
    if (!examAttemptsResult.ok) {
      throw new NotFoundException(examAttemptsResult.error);
    }
    return { examAttempts: examAttemptsResult.data };
  }

  @ApiResponse({
    type: MockExamAttemptFindOneResponseDto,
    description: 'Returns mock exam attempt of given id',
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MockExamAttemptFindOneResponseDto> {
    const examAttemptResult = await this.mockExamAttemptService.findOne(id);
    if (!examAttemptResult.ok) {
      throw new NotFoundException();
    }
    const questionsToBeFetched = examAttemptResult.data.questions.map(
      (el) => el.questionId,
    );
    const questionsResult = await this.mockExamQuestionService.getQuestions(
      questionsToBeFetched,
    );
    if (!questionsResult.ok) {
      throw new NotFoundException();
    }
    return {
      examAttempt: examAttemptResult.data,
      questions: questionsResult.data,
    };
  }

  @ApiResponse({
    type: MockExamAttemptSubmitResponseDto,
    description: 'Saves new attempt',
  })
  @Post()
  async submit(
    @Body() attempt: MockExamAttemptSubmitRequestDto,
  ): Promise<MockExamAttemptSubmitResponseDto> {
    const { userId } = this.currentUserService.getRequestCurrentUser();
    const examAttemptResponse = await this.mockExamAttemptService.submit({
      questions: attempt.mockExam.questions,
      userId,
    });
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
