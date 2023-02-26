import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DtoMockExamQuestionAnswer } from '../mockExamQuestionAnswer/mockExamQuestionAnswer.dto';
import { DtoMockExamQuestionType } from '../mockExamQuestionType/mockExamQuestionType.dto';

export class MockExamQuestionDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsString()
  question: string;

  @ApiProperty({ type: 'string', nullable: true })
  @IsString()
  @IsOptional()
  mediaURL: string | null;

  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
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
