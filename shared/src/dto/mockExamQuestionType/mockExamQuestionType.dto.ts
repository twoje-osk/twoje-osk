import { ApiProperty } from '@nestjs/swagger';

export class DtoMockExamQuestionType {
  @ApiProperty()
  timeToReadTheQuestion: number;

  @ApiProperty()
  timeToAnswer: number;

  @ApiProperty()
  scope: string;
}
