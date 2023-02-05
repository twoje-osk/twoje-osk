import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MockExamQuestionsAmount } from '../mockExamQuestionsAmount/entities/mockExamQuestionsAmount.entity';
import { MockExamQuestion } from './entities/mockExamQuestion.entity';
import { MockExamQuestionType } from './entities/mockExamQuestionType.entity';
import { MockExamQuestionsController } from './mockExamQuestion.controller';
import { MockExamQuestionService } from './mockExamQuestion.service';

@Module({
  controllers: [MockExamQuestionsController],
  imports: [
    TypeOrmModule.forFeature([
      MockExamQuestion,
      MockExamQuestionType,
      MockExamQuestionsAmount,
    ]),
  ],
  providers: [MockExamQuestionService],
  exports: [MockExamQuestionService],
})
export class MockExamQuestionModule {}
