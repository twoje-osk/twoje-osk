import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class MockExamQuestionAttemptDto {
  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty({ type: 'number' })
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

  @ApiProperty({ type: 'number' })
  @IsOptional()
  @IsNumber()
  answerId: number | undefined;
}
