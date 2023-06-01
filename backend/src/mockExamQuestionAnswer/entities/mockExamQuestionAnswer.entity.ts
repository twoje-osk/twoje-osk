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

  @ManyToOne(() => MockExamQuestion, { onDelete: 'CASCADE' })
  question: MockExamQuestion;

  @RelationId((answer: MockExamQuestionAnswer) => answer.question)
  questionId: number;

  @OneToOne<MockExamQuestion>(
    'MockExamQuestion',
    (question) => question.correctAnswer,
    { onDelete: 'CASCADE' },
  )
  isCorrectAnswerOf: MockExamQuestion;

  @RelationId((answer: MockExamQuestionAnswer) => answer.isCorrectAnswerOf)
  isCorrectAnswerOfId: number;
}
