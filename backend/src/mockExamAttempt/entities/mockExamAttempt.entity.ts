import {
  Entity,
  Column,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import type { MockExamQuestionAttempt } from '../../mockExamQuestionAttempt/entities/mockExamQuestionAttempt.entity';
import { Trainee } from '../../trainees/entities/trainee.entity';

@Entity()
export class MockExamAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trainee)
  trainee: Trainee;

  @RelationId((examAttempt: MockExamAttempt) => examAttempt.trainee)
  traineeId: number;

  @Column()
  attemptDate: Date;

  @Column()
  @OneToMany<MockExamQuestionAttempt>(
    'MockExamAttemptQuestion',
    (questionAttempt) => questionAttempt.question,
  )
  questions: MockExamQuestionAttempt[];

  @Column()
  @RelationId((attempt: MockExamAttempt) => attempt.questions)
  questionsIds: number[];
}
