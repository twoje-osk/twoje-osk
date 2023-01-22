import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DtoMockExamQuestionAnswer } from '../mockExamQuestionAnswer/mockExamQuestionAnswer.dto';
import { DtoMockExamQuestionType } from '../mockExamQuestionType/mockExamQuestionType.dto';

export class MockExamQuestionDto {
  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty({ nullable: true })
  @IsString()
  @IsOptional()
  mediaURL: string | null;

  @ApiProperty()
  @IsArray()
  @ValidateNested()
  answers: DtoMockExamQuestionAnswer[];

  @ApiProperty()
  type: DtoMockExamQuestionType;
}

export class MockExamQuestionsGenerateResponseDto {
  @ApiProperty({
    type: MockExamQuestionDto,
    isArray: true,
  })
  @ValidateNested({ each: true })
  questions: MockExamQuestionDto[];
}