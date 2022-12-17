import { MockExamQuestionAnswer } from '../../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { Factory } from '../seed.utils';

class MockExamQuestionAnswerFactory extends Factory<MockExamQuestionAnswer> {
  constructor() {
    super(MockExamQuestionAnswer);
  }

  public generate() {
    const answer = new MockExamQuestionAnswer();
    this.entities.push(answer);
    return answer;
  }
}

export const mockExamQuestionAnswerFactory =
  new MockExamQuestionAnswerFactory();

export interface ParsedAnswersData {
  answerId: number;
  questionId: number;
  answerContent: string;
}
