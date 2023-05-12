import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  UserRole,
  MockExamAttemptFindAllResponseDto,
  MockExamAttemptFindOneResponseDto,
  MockExamAttemptSubmitResponseDto,
  MockExamAttemptSubmitRequestDto,
  MockExamAttemptFindAllQueryDto,
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

  @ApiResponse({
    type: MockExamAttemptFindAllResponseDto,
    description: 'Returns all mock exam attempts of currently logged user',
  })
  @Get()
  async findAllMyAttempts(
    @Query() query: MockExamAttemptFindAllQueryDto,
  ): Promise<MockExamAttemptFindAllResponseDto> {
    const { userId: id } = this.currentUserService.getRequestCurrentUser();

    const result = await this.mockExamAttemptService.findAllAttemptsOfUser(id, {
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
      },
      sort: {
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
      },
      filter: query.filters ?? {},
    });

    if (!result.ok) {
      throw new NotFoundException(result.error);
    }

    const { mockExamAttempts, count } = result.data;

    return { examAttempts: mockExamAttempts, total: count };
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
    if (attempt.mockExam.categoryId === undefined) {
      throw new BadRequestException('Missing categoryId');
    }
    const examAttemptResponse = await this.mockExamAttemptService.submit({
      questions: attempt.mockExam.questions,
      categoryId: attempt.mockExam.categoryId,
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
