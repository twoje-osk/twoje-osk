import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockExamQuestion } from '../mockExamQuestion/entities/mockExamQuestion.entity';
import { MockExamQuestionAnswer } from '../mockExamQuestionAnswer/entities/mockExamQuestionAnswer.entity';
import { MockExamQuestionAttempt } from './entities/mockExamQuestionAttempt.entity';
import { MockExamQuestionAttemptService } from './mockExamQuestionAttempt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MockExamQuestionAttempt,
      MockExamQuestionAnswer,
      MockExamQuestion,
    ]),
  ],
  providers: [MockExamQuestionAttemptService],
  exports: [MockExamQuestionAttemptService],
})
export class MockExamQuestionAttemptModule {}
