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

  @OneToMany<MockExamQuestionAttempt>(
    'MockExamQuestionAttempt',
    (questionAttempt) => questionAttempt.attempt,
    { cascade: true },
  )
  questions: MockExamQuestionAttempt[];

  @RelationId((attempt: MockExamAttempt) => attempt.questions)
  questionsIds: number[];

  @Column()
  score: number;

  @Column()
  isPassed: boolean;
}
