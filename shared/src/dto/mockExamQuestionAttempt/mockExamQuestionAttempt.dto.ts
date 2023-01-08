import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class MockExamQuestionAttemptDto {
  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsNumber()
  answerId: number;

  @ApiProperty()
  @IsNumber()
  attemptId: number;
}
export class CreateMockExamQuestionAttemptRequestDto {
  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsNumber()
  answerId: number;
}
