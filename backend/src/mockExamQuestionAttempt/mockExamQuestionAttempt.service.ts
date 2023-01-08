import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MockExamQuestionAnswer } from '../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { Try, getFailure, getSuccess } from '../types/Try';

import { MockExamQuestionAttempt } from './entities/mockExamQuestionAttempt.entity';

interface MockExamQuestionsAttemptFields {
  attemptId: number;
  questionId: number;
  answerId: number;
}

@Injectable()
export class MockExamQuestionAttemptService {
  constructor(
    @InjectRepository(MockExamQuestionAttempt)
    private mockExamQuestionAttemptRepository: Repository<MockExamQuestionAttempt>,
    @InjectRepository(MockExamQuestionAnswer)
    private mockExamQuestionAnswerRepository: Repository<MockExamQuestionAnswer>,
  ) {}

  @Transactional()
  async createMany(
    questionAttempts: MockExamQuestionsAttemptFields[],
  ): Promise<
    Try<MockExamQuestionAttempt[], 'QUESTIONS_NOT_UNIQUE' | 'ANSWER_NOT_FOUND'>
  > {
    const questionsIds = questionAttempts.map(
      (question) => question.questionId,
    );
    const uniqueQuestions = new Set(questionsIds);
    if (uniqueQuestions.size !== questionsIds.length) {
      return getFailure('QUESTIONS_NOT_UNIQUE');
    }
    const answers = await this.mockExamQuestionAnswerRepository.find({
      where: { id: In(questionAttempts.map((q) => q.questionId)) },
    });
    const answersMap = Object.fromEntries(
      answers.map((a) => [a.id, a.questionId]),
    );
    const areAnswersValid = questionAttempts.every(
      (q) => q.questionId === answersMap[q.answerId],
    );
    if (!areAnswersValid) {
      return getFailure('ANSWER_NOT_FOUND');
    }
    const savedQuestionAttempts =
      await this.mockExamQuestionAttemptRepository.save(questionAttempts);
    return getSuccess(savedQuestionAttempts);
  }
}
