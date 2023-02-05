import { MockExamQuestionType } from '../../mockExamQuestion/entities/mockExamQuestionType.entity';
import { Factory } from '../seed.utils';

class MockExamQuestionTypeFactory extends Factory<MockExamQuestionType> {
  constructor() {
    super(MockExamQuestionType);
  }

  public generate() {
    const questionType = new MockExamQuestionType();
    questionType.scope = this.faker.lorem.word(1);
    questionType.timeToReadTheQuestion = 20;
    questionType.timeToAnswer = 15;
    this.entities.push(questionType);
    return questionType;
  }
}

export const mockExamQuestionTypesFactory = new MockExamQuestionTypeFactory();

export interface ParsedTypesData {
  questionTypeId: number;
  scope: string;
  timeToReadTheQuestion: number;
  timeToAnswer: number;
}
