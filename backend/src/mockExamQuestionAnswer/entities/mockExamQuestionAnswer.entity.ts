import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { MockExamQuestion } from '../../mockExamQuestion/entities/mockExamQuestion.entity';

@Entity()
export class MockExamQuestionAnswer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  answerContent: string;

  @ManyToOne(() => MockExamQuestion)
  question: MockExamQuestion;

  @RelationId((answer: MockExamQuestionAnswer) => answer.question)
  questionId: number;

  @OneToOne<MockExamQuestion>(
    'MockExamQuestion',
    (question) => question.correctAnswer,
  )
  isCorrectAnswerOf: MockExamQuestion;

  @RelationId((answer: MockExamQuestionAnswer) => answer.isCorrectAnswerOf)
  isCorrectAnswerOfId: number;
}
