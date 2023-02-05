import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DtoMockExamQuestionAnswer {
  @ApiProperty()
  @IsString()
  answerContent: string;
}
