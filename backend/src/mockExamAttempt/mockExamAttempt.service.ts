import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MockExamAttemptSubmitRequestDto } from '@osk/shared';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { REQUIRED_AMOUNT_OF_QUESTIONS } from '../mockExamQuestion/mockExamQuestion.constants';
import { MockExamQuestionAttemptService } from '../mockExamQuestionAttempt/mockExamQuestionAttempt.service';
import { TraineesService } from '../trainees/trainees.service';
import { Try, getFailure, getSuccess } from '../types/Try';
import { MockExamAttempt } from './entities/mockExamAttempt.entity';

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
    const trainee = await this.traineeService.findOneById(id);
    if (trainee === null) {
      return getFailure('TRAINEE_DOES_NOT_EXIST');
    }
    const attempts = await this.mockExamAttemptRepository.find({
      where: {
        traineeId: id,
      },
      relations: {
        questions: true,
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

  @Transactional()
  async submit(
    attempt: MockExamAttemptSubmitRequestDto,
  ): Promise<
    Try<
      number,
      | 'USER_NOT_FOUND'
      | 'QUESTIONS_NOT_UNIQUE'
      | 'INCORRECT_AMOUNT_OF_QUESTIONS'
      | 'ANSWER_NOT_FOUND'
    >
  > {
    const { questions, traineeId } = attempt.mockExam;
    const trainee = await this.traineeService.findOneById(traineeId);
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
    });

    const questionsWithAttempt = questions.map((question) => ({
      ...question,
      attempt: newAttempt,
    }));

    const result = await this.mockExamQuestionAttemptService.createMany(
      questionsWithAttempt,
    );

    if (!result.ok) {
      return getFailure(result.error);
    }

    return getSuccess(newAttempt.id);
  }
}
