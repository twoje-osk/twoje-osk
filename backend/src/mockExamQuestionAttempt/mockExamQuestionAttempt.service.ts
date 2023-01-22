import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { MockExamAttempt } from '../mockExamAttempt/entities/mockExamAttempt.entity';
import { MockExamQuestion } from '../mockExamQuestion/entities/mockExamQuestion.entity';
import { MockExamQuestionAnswer } from '../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { Try, getFailure, getSuccess } from '../types/Try';

import { MockExamQuestionAttempt } from './entities/mockExamQuestionAttempt.entity';

interface MockExamQuestionsAttemptFields {
  attempt: MockExamAttempt;
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
    @InjectRepository(MockExamQuestion)
    private mockExamQuestionRepository: Repository<MockExamQuestion>,
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
    const areAnswersValid = questionAttempts.every(
      (q) => q.questionId === answersIdToQuestionId[q.answerId],
    );
    if (!areAnswersValid) {
      return getFailure('ANSWER_NOT_FOUND');
    }
    const savedQuestionAttempts =
      await this.mockExamQuestionAttemptRepository.save(
        questionAttempts.map((q) => ({
          ...q,
          question: questionsMap[q.questionId],
          answer: answersMap[q.answerId],
        })),
      );
    return getSuccess(savedQuestionAttempts);
  }
}
