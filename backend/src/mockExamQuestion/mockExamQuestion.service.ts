import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MockExamQuestionsGenerateResponseDto } from '@osk/shared';

import { In, Repository } from 'typeorm';
import { MockExamQuestionsAmount } from '../mockExamQuestionsAmount/entities/mockExamQuestionsAmount.entity';
import { getFailure, getSuccess, Try } from '../types/Try';

import { MockExamQuestion } from './entities/mockExamQuestion.entity';
import { MockExamQuestionType } from './entities/mockExamQuestionType.entity';
import {
  ADVANCED_SCOPE,
  ELEMENTARY_SCOPE,
  REQUIRED_AMOUNT_OF_ONE_POINT_ADVANCED_QUESTIONS,
  REQUIRED_AMOUNT_OF_ONE_POINT_QUESTIONS,
  REQUIRED_AMOUNT_OF_TWO_POINT_ADVANCED_QUESTIONS,
  REQUIRED_AMOUNT_OF_TWO_POINT_QUESTIONS,
  REQUIRED_AMOUNT_OF_THREE_POINT_ADVANCED_QUESTIONS,
  REQUIRED_AMOUNT_OF_THREE_POINT_QUESTIONS,
} from './mockExamQuestion.constants';

interface QuestionsDistribution {
  onePointQuestionsAmount: number;
  twoPointQuestionsAmount: number;
  threePointQuestionsAmount: number;
  onePointAdvancedQuestionsAmount: number;
  twoPointAdvancedQuestionsAmount: number;
  threePointAdvancedQuestionsAmount: number;
}

@Injectable()
export class MockExamQuestionService {
  constructor(
    @InjectRepository(MockExamQuestion)
    private mockExamQuestionRepository: Repository<MockExamQuestion>,
    @InjectRepository(MockExamQuestionsAmount)
    private questionsAmountRepository: Repository<MockExamQuestionsAmount>,
    @InjectRepository(MockExamQuestionType)
    private questionsTypeRepository: Repository<MockExamQuestionType>,
  ) {}

  async generateExam(
    categoryId: number,
  ): Promise<
    Try<MockExamQuestionsGenerateResponseDto, 'NO_QUESTION_TYPES_FOUND'>
  > {
    const questionsDistributionResult = await this.getQuestionsDistribution(
      categoryId,
    );
    if (questionsDistributionResult.ok !== true) {
      return getFailure(questionsDistributionResult.error);
    }
    const questionsDistribution = questionsDistributionResult.data;
    const randomQuestionsResult = await this.getRandomQuestions(
      questionsDistribution,
      categoryId,
    );
    if (randomQuestionsResult.ok !== true) {
      return getFailure(randomQuestionsResult.error);
    }
    return getSuccess({ questions: randomQuestionsResult.data });
  }

  async getQuestionsDistribution(
    categoryId: number,
  ): Promise<Try<QuestionsDistribution, 'NO_QUESTION_TYPES_FOUND'>> {
    const elementaryQuestionType = await this.questionsTypeRepository.findOne({
      where: {
        scope: ELEMENTARY_SCOPE,
      },
    });
    const advancedQuestionType = await this.questionsTypeRepository.findOne({
      where: {
        scope: ADVANCED_SCOPE,
      },
    });
    if (!elementaryQuestionType || !advancedQuestionType) {
      return getFailure('NO_QUESTION_TYPES_FOUND');
    }
    const [
      onePointQuestionsAmount,
      twoPointQuestionsAmount,
      threePointQuestionsAmount,
      onePointAdvancedQuestionsAmount,
      twoPointAdvancedQuestionsAmount,
      threePointAdvancedQuestionsAmount,
    ] = await Promise.all([
      this.getAmountOfQuestions(categoryId, 1, elementaryQuestionType.id),
      this.getAmountOfQuestions(categoryId, 2, elementaryQuestionType.id),
      this.getAmountOfQuestions(categoryId, 3, elementaryQuestionType.id),
      this.getAmountOfQuestions(categoryId, 1, advancedQuestionType.id),
      this.getAmountOfQuestions(categoryId, 2, advancedQuestionType.id),
      this.getAmountOfQuestions(categoryId, 3, advancedQuestionType.id),
    ]);

    return getSuccess({
      onePointQuestionsAmount,
      onePointAdvancedQuestionsAmount,
      twoPointQuestionsAmount,
      twoPointAdvancedQuestionsAmount,
      threePointQuestionsAmount,
      threePointAdvancedQuestionsAmount,
    });
  }

  async getAmountOfQuestions(
    categoryId: number,
    points: number,
    typeId: number,
  ) {
    const result = await this.questionsAmountRepository.findOne({
      where: {
        categoryId,
        points,
        typeId,
      },
    });
    return result?.amount ?? 0;
  }

  async getRandomQuestions(
    questionsDistribution: QuestionsDistribution,
    categoryId: number,
  ): Promise<Try<MockExamQuestion[], 'NO_QUESTION_TYPES_FOUND'>> {
    const {
      onePointQuestionsAmount,
      onePointAdvancedQuestionsAmount,
      twoPointQuestionsAmount,
      twoPointAdvancedQuestionsAmount,
      threePointQuestionsAmount,
      threePointAdvancedQuestionsAmount,
    } = questionsDistribution;
    const elementaryQuestionType = await this.questionsTypeRepository.findOne({
      where: {
        scope: ELEMENTARY_SCOPE,
      },
    });
    const advancedQuestionType = await this.questionsTypeRepository.findOne({
      where: {
        scope: ADVANCED_SCOPE,
      },
    });
    if (!elementaryQuestionType || !advancedQuestionType) {
      return getFailure('NO_QUESTION_TYPES_FOUND');
    }
    const retrievedQuestions = await Promise.all([
      this.getRandomQuestionsForType(
        onePointQuestionsAmount,
        REQUIRED_AMOUNT_OF_ONE_POINT_QUESTIONS,
        elementaryQuestionType.id,
        1,
        categoryId,
      ),
      this.getRandomQuestionsForType(
        twoPointQuestionsAmount,
        REQUIRED_AMOUNT_OF_TWO_POINT_QUESTIONS,
        elementaryQuestionType.id,
        2,
        categoryId,
      ),
      this.getRandomQuestionsForType(
        threePointQuestionsAmount,
        REQUIRED_AMOUNT_OF_THREE_POINT_QUESTIONS,
        elementaryQuestionType.id,
        3,
        categoryId,
      ),
      this.getRandomQuestionsForType(
        onePointAdvancedQuestionsAmount,
        REQUIRED_AMOUNT_OF_ONE_POINT_ADVANCED_QUESTIONS,
        advancedQuestionType.id,
        1,
        categoryId,
      ),
      this.getRandomQuestionsForType(
        twoPointAdvancedQuestionsAmount,
        REQUIRED_AMOUNT_OF_TWO_POINT_ADVANCED_QUESTIONS,
        advancedQuestionType.id,
        2,
        categoryId,
      ),
      this.getRandomQuestionsForType(
        threePointAdvancedQuestionsAmount,
        REQUIRED_AMOUNT_OF_THREE_POINT_ADVANCED_QUESTIONS,
        advancedQuestionType.id,
        3,
        categoryId,
      ),
    ]);
    const questions: MockExamQuestion[] = retrievedQuestions.flat();
    return getSuccess(questions);
  }

  async getRandomQuestionsForType(
    totalAmount: number,
    requiredAmount: number,
    typeId: number,
    points: number,
    categoryId: number,
  ): Promise<MockExamQuestion[]> {
    const indexes = this.getRandomIndexes(totalAmount, requiredAmount);
    const questionsPromises: Promise<MockExamQuestion[]>[] = indexes.map(
      (index) => {
        return this.mockExamQuestionRepository.find({
          where: {
            points,
            type: {
              id: typeId,
            },
            categories: {
              id: categoryId,
            },
          },
          skip: index,
          take: 1,
          relations: {
            answers: true,
            type: true,
            categories: true,
          },
        });
      },
    );
    const questions = await Promise.all(questionsPromises);
    return questions.flat();
  }

  getRandomIndexes(
    totalAmountOfIndexes: number,
    requiredAmountOfIndexes: number,
  ): number[] {
    const indexes: number[] = [];
    let counter = 0;
    while (indexes.length < requiredAmountOfIndexes) {
      if (counter === requiredAmountOfIndexes * 1000) {
        throw new Error('Failed to generate random questions');
      }
      const index = Math.floor(Math.random() * totalAmountOfIndexes);
      if (!indexes.includes(index)) {
        indexes.push(index);
      }
      // eslint-disable-next-line no-plusplus
      counter++;
    }
    return indexes;
  }

  async getQuestions(
    questionsIds: number[],
  ): Promise<Try<MockExamQuestion[], 'INCORRECT_IDS'>> {
    const questions = await this.mockExamQuestionRepository.find({
      where: {
        id: In(questionsIds),
      },
      relations: {
        answers: true,
        type: true,
      },
    });
    if (!questions) {
      return getFailure('INCORRECT_IDS');
    }
    return getSuccess(questions);
  }
}
