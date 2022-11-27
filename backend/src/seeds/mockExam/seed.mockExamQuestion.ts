import { MockExamQuestion } from '../../mockExamQuestion/entities/mockExamQuestion.entity';
import { Factory } from '../seed.utils';

class MockExamQuestionFactory extends Factory<MockExamQuestion> {
  constructor() {
    super(MockExamQuestion);
  }

  public generate() {
    const question = new MockExamQuestion();
    this.entities.push(question);
    return question;
  }
}

export const mockExamQuestionFactory = new MockExamQuestionFactory();

export interface ParsedQuestionsData {
  id: number;
  question: string;
  mediaReference: string;
  points: number;
  typeId: number;
  correctAnswerId: number;
}
