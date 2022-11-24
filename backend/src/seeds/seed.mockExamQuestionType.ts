import { MockExamQuestionType } from 'mockExamQuestion/entities/mockExamQuestionType.entity';
import { Factory } from './seed.utils';

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

export const seedMockExamQuestionTypes = () => {
  return [
    mockExamQuestionTypesFactory.generateFromData({
      scope: 'Podstawowy',
      timeToReadTheQuestion: 20,
      timeToAnswer: 15,
    }),
    mockExamQuestionTypesFactory.generateFromData({
      scope: 'Specjalistyczny',
      timeToReadTheQuestion: 0,
      timeToAnswer: 50,
    }),
  ];
};
