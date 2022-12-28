import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class DtoCreateMockExamQuestionAttempt {
  @ApiProperty()
  @IsNumber()
  questionId: number;
}
