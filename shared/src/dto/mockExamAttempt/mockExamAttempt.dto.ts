import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { MockExamQuestionDto } from '../mockExamQuestion/mockExamQuestion.dto';
import {
  CreateMockExamQuestionAttemptRequestDto,
  MockExamQuestionAttemptDto,
} from '../mockExamQuestionAttempt/mockExamQuestionAttempt.dto';
import { TraineeDto } from '../trainee/trainee.dto';

export class DtoMockExamAttempt {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TraineeDto)
  trainee: TraineeDto;

  @ApiProperty({
    type: 'string',
  })
  attemptDate: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MockExamQuestionAttemptDto)
  questions: MockExamQuestionAttemptDto[];

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  questionsIds: number[];

  @ApiProperty()
  @IsNumber()
  score: number;

  @ApiProperty()
  @IsBoolean()
  isPassed: boolean;
}

export class SubmitMockExamAttemptDto {
  @ApiProperty({ isArray: true, type: CreateMockExamQuestionAttemptRequestDto })
  @ValidateNested()
  @Type(() => CreateMockExamQuestionAttemptRequestDto)
  questions: CreateMockExamQuestionAttemptRequestDto[];
}

export class MockExamAttemptFindAllResponseDto {
  @ApiProperty({ type: DtoMockExamAttempt, isArray: true })
  examAttempts: DtoMockExamAttempt[];
}

export class MockExamAttemptFindOneResponseDto {
  @ApiProperty({ type: DtoMockExamAttempt })
  examAttempt: DtoMockExamAttempt;

  @ApiProperty({ isArray: true, type: MockExamQuestionDto })
  @ValidateNested()
  @Type(() => MockExamQuestionDto)
  questions: MockExamQuestionDto[];
}

export class MockExamAttemptSubmitResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class MockExamAttemptSubmitRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubmitMockExamAttemptDto)
  mockExam: SubmitMockExamAttemptDto;
}
