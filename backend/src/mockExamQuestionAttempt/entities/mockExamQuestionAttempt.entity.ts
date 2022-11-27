import { Entity, ManyToOne, PrimaryGeneratedColumn, RelationId } from 'typeorm';
import { MockExamQuestionAnswer } from '../../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { MockExamAttempt } from '../../mockExamAttempt/entities/mockExamAttempt.entity';
import { MockExamQuestion } from '../../mockExamQuestion/entities/mockExamQuestion.entity';

@Entity()
export class MockExamQuestionAttempt {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MockExamQuestion)
  question: MockExamQuestion;

  @RelationId(
    (questionAttempt: MockExamQuestionAttempt) => questionAttempt.question,
  )
  questionId: number;

  @ManyToOne(() => MockExamAttempt)
  attempt: MockExamAttempt;

  @RelationId(
    (questionAttempt: MockExamQuestionAttempt) => questionAttempt.attempt,
  )
  attemptId: number;

  @ManyToOne(() => MockExamQuestionAnswer, { nullable: true })
  answer: MockExamQuestionAnswer;

  @RelationId(
    (questionAttempt: MockExamQuestionAttempt) => questionAttempt.answer,
  )
  answerId: number;
}
