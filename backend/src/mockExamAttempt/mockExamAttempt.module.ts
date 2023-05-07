import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockExamQuestionAttemptModule } from '../mockExamQuestionAttempt/mockExamQuestionAttempt.module';
import { TraineesModule } from '../trainees/trainees.module';
import { MockExamAttempt } from './entities/mockExamAttempt.entity';
import { MockExamAttemptController } from './mockExamAttempt.controller';
import { MockExamAttemptService } from './mockExamAttempt.service';
import { MockExamQuestionModule } from '../mockExamQuestion/mockExamQuestion.module';

@Module({
  controllers: [MockExamAttemptController],
  imports: [
    TypeOrmModule.forFeature([MockExamAttempt]),
    TraineesModule,
    MockExamQuestionAttemptModule,
    MockExamQuestionModule,
  ],
  providers: [MockExamAttemptService],
  exports: [MockExamAttemptService],
})
export class MockExamAttemptModule {}
