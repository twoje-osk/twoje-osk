import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class DtoMockExamQuestionAnswer {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  answerContent: string;

  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsNumber()
  isCorrectAnswerOfId: number;
}
