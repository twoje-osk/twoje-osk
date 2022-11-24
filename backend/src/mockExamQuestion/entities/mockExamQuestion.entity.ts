import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
// eslint-disable-next-line import/no-cycle
import { MockExamQuestionAnswer } from '../../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { MockExamQuestionType } from './mockExamQuestionType.entity';

@Entity()
export class MockExamQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  question: string;

  @Column()
  points: number;

  @Column()
  mediaURL: string;

  @OneToOne<MockExamQuestionAnswer>(
    'MockExamQuestionAnswer',
    (answer) => answer.questionId,
  )
  correctAnswer: MockExamQuestionAnswer;

  @Exclude()
  @RelationId((question: MockExamQuestion) => question.correctAnswer)
  correctAnswerId: number;

  @ManyToOne(() => MockExamQuestionType)
  @JoinColumn({ name: 'typeId' })
  type: MockExamQuestionType;

  @Exclude()
  @RelationId((question: MockExamQuestion) => question.type)
  typeId: number;
}
