import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { TransactionalWithTry } from '../utils/TransactionalWithTry';
import { MockExamAttempt } from './entities/mockExamAttempt.entity';

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

  async findAllAttemptsOfUser(
    id: number,
  ): Promise<Try<MockExamAttempt[], 'TRAINEE_DOES_NOT_EXIST'>> {
    const trainee = await this.traineeService.findOneByUserId(id);
    if (trainee === null) {
      return getFailure('TRAINEE_DOES_NOT_EXIST');
    }
    const attempts = await this.mockExamAttemptRepository.find({
      where: {
        trainee: {
          id: trainee.id,
        },
      },
      relations: {
        questions: true,
      },
      order: {
        attemptDate: 'DESC',
      },
    });

    return getSuccess(attempts);
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
