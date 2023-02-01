import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

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

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsBoolean()
  isPassed: boolean;
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
