import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class MockExamQuestionAttemptDto {
  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  answerId: number | undefined;

  @ApiProperty()
  @IsNumber()
  attemptId: number;
}
export class CreateMockExamQuestionAttemptRequestDto {
  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  answerId: number | undefined;
}
