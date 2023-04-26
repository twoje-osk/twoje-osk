import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';
import { MockExamAttempt } from '../mockExamAttempt/entities/mockExamAttempt.entity';
import { MockExamQuestion } from '../mockExamQuestion/entities/mockExamQuestion.entity';
import { MockExamQuestionAnswer } from '../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { Try, getFailure, getSuccess } from '../types/Try';
import { TransactionalWithTry } from '../utils/TransactionalWithTry';

import {
  MockExamQuestionAttempt,
  QuestionStatus,
} from './entities/mockExamQuestionAttempt.entity';

export interface MockExamQuestionsAttemptFields {
  attempt: MockExamAttempt;
  questionId: number;
  answerId?: number;
  status?: QuestionStatus;
}

@Injectable()
export class MockExamQuestionAttemptService {
  constructor(
    @InjectRepository(MockExamQuestionAttempt)
    private mockExamQuestionAttemptRepository: Repository<MockExamQuestionAttempt>,
    @InjectRepository(MockExamQuestionAnswer)
    private mockExamQuestionAnswerRepository: Repository<MockExamQuestionAnswer>,
    @InjectRepository(MockExamQuestion)
    private mockExamQuestionRepository: Repository<MockExamQuestion>,
  ) {}

  @TransactionalWithTry()
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
      where: { id: In(questionAttempts.map((q) => q.answerId)) },
    });
    const questions = await this.mockExamQuestionRepository.find({
      where: { id: In(questionAttempts.map((q) => q.questionId)) },
    });
    const answersIdToQuestionId = Object.fromEntries(
      answers.map((a) => [a.id, a.questionId]),
    );
    const answersMap = Object.fromEntries(answers.map((a) => [a.id, a]));
    const questionsMap = Object.fromEntries(questions.map((q) => [q.id, q]));
    this.checkIfAnswersAreCorrect(questionAttempts, answersMap);
    const areAnswersValid = questionAttempts.every((q) => {
      if (q.answerId !== undefined) {
        return q.questionId === answersIdToQuestionId[q.answerId];
      }
      return true;
    });
    if (!areAnswersValid) {
      return getFailure('ANSWER_NOT_FOUND');
    }
    const savedQuestionAttempts =
      await this.mockExamQuestionAttemptRepository.save(
        questionAttempts.map((q) => ({
          ...q,
          question: questionsMap[q.questionId],
          answer: q.answerId ? answersMap[q.answerId] : undefined,
        })),
      );
    return getSuccess(savedQuestionAttempts);
  }

  private checkIfAnswersAreCorrect(
    questionAttempts: MockExamQuestionsAttemptFields[],
    answersMap: Record<number, MockExamQuestionAnswer>,
  ) {
    questionAttempts.forEach((attempt) => {
      /* eslint-disable no-param-reassign */
      if (attempt?.answerId === undefined) {
        attempt.status = QuestionStatus.UNANSWERED;
      } else if (
        attempt?.questionId ===
        answersMap[attempt.answerId]?.isCorrectAnswerOfId
      ) {
        attempt.status = QuestionStatus.CORRECT;
      } else {
        attempt.status = QuestionStatus.INCORRECT;
      }
      /* eslint-enable no-param-reassign */
    });
  }
}
