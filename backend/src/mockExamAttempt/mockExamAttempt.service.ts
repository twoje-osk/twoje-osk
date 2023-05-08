import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsWhere, Repository } from 'typeorm';
import {
  MINIMAL_PASSING_SCORE,
  REQUIRED_AMOUNT_OF_QUESTIONS,
} from '../mockExamQuestion/mockExamQuestion.constants';
import {
  MockExamQuestionAttempt,
  QuestionStatus,
} from '../mockExamQuestionAttempt/entities/mockExamQuestionAttempt.entity';
import { MockExamQuestionAttemptService } from '../mockExamQuestionAttempt/mockExamQuestionAttempt.service';
import { TraineesService } from '../trainees/trainees.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { getLimitArguments } from '../utils/presentationArguments';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { MockExamAttempt } from './entities/mockExamAttempt.entity';
import {
  MockExamAttemptPresentationSortArguments,
  MockExamAttemptPresentationFilterArguments,
  MockExamAttemptPresentationArguments,
} from './mockExamAttempt.types';
import { isMockExamAttemptSortField } from './mockExamAttempt.utils';

interface QuestionFields {
  questionId: number;
  answerId: number | undefined;
}
interface MockExamAttemptFields {
  userId: number;
  questions: QuestionFields[];
}

@Injectable()
export class MockExamAttemptService {
  constructor(
    @InjectRepository(MockExamAttempt)
    private mockExamAttemptRepository: Repository<MockExamAttempt>,
    private traineeService: TraineesService,
    private mockExamQuestionAttemptService: MockExamQuestionAttemptService,
  ) {}

  private buildOrderOption(
    sortArguments: MockExamAttemptPresentationSortArguments | undefined,
  ): FindManyOptions<MockExamAttempt>['order'] {
    const sortOrder = sortArguments?.sortOrder ?? 'desc';

    const defaultSortOrder = {
      attemptDate: sortOrder,
    };

    if (sortArguments?.sortBy === undefined) {
      return defaultSortOrder;
    }

    if (isMockExamAttemptSortField(sortArguments.sortBy)) {
      return {
        [sortArguments.sortBy]: sortOrder,
      };
    }

    return defaultSortOrder;
  }

  private buildWhereOption(
    filterArguments: MockExamAttemptPresentationFilterArguments | undefined,
    traineeId: number,
  ): FindOptionsWhere<MockExamAttempt> {
    const isPassedProperty = filterArguments?.isPassed;

    return {
      isPassed: isPassedProperty,
      trainee: { id: traineeId },
    };
  }

  async findAllAttemptsOfUser(
    id: number,
    presentationArguments?: MockExamAttemptPresentationArguments,
  ): Promise<
    Try<
      { mockExamAttempts: MockExamAttempt[]; count: number },
      'TRAINEE_DOES_NOT_EXIST'
    >
  > {
    const trainee = await this.traineeService.findOneByUserId(id);
    if (trainee === null) {
      return getFailure('TRAINEE_DOES_NOT_EXIST');
    }

    const limitArguments = getLimitArguments(presentationArguments?.pagination);

    const [mockExamAttempts, count] =
      await this.mockExamAttemptRepository.findAndCount({
        ...limitArguments,
        order: this.buildOrderOption(presentationArguments?.sort),
        where: this.buildWhereOption(presentationArguments?.filter, trainee.id),
        relations: {
          questions: true,
        },
      });

    return getSuccess({ mockExamAttempts, count });
  }

  async findOne(
    id: number,
  ): Promise<Try<MockExamAttempt, 'ATTEMPT_DOES_NOT_EXIST'>> {
    const attempt = await this.mockExamAttemptRepository.findOne({
      where: {
        id,
      },
      relations: {
        questions: true,
      },
    });
    if (attempt === null) {
      return getFailure('ATTEMPT_DOES_NOT_EXIST');
    }
    return getSuccess(attempt);
  }

  @TransactionalWithTry()
  async submit(
    attempt: MockExamAttemptFields,
  ): Promise<
    Try<
      number,
      | 'USER_NOT_FOUND'
      | 'QUESTIONS_NOT_UNIQUE'
      | 'INCORRECT_AMOUNT_OF_QUESTIONS'
      | 'ANSWER_NOT_FOUND'
    >
  > {
    const { questions, userId } = attempt;
    const trainee = await this.traineeService.findOneByUserId(userId);
    if (!trainee) {
      return getFailure('USER_NOT_FOUND');
    }
    if (questions.length !== REQUIRED_AMOUNT_OF_QUESTIONS) {
      return getFailure('INCORRECT_AMOUNT_OF_QUESTIONS');
    }

    const newAttempt = await this.mockExamAttemptRepository.save({
      trainee,
      attemptDate: new Date(),
      questions: [],
      score: 0,
      isPassed: false,
    });

    const questionsWithAttempt = questions.map((question) => ({
      ...question,
      attempt: newAttempt,
    }));

    const createQuestionsResult =
      await this.mockExamQuestionAttemptService.createMany(
        questionsWithAttempt,
      );

    if (!createQuestionsResult.ok) {
      return getFailure(createQuestionsResult.error);
    }

    const createdQuestions = createQuestionsResult.data;

    const score = this.calculateScore(createdQuestions);

    const isPassed = score >= MINIMAL_PASSING_SCORE;

    await this.mockExamAttemptRepository.update(
      { id: newAttempt.id },
      { score, isPassed },
    );

    return getSuccess(newAttempt.id);
  }

  private calculateScore(questions: MockExamQuestionAttempt[]) {
    let score = 0;
    questions.forEach((q) => {
      if (q.status === QuestionStatus.CORRECT) {
        score += q.question.points;
      }
    });
    return score;
  }
}
