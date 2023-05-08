import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
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

  @ApiProperty()
  total: number;
}

export class MockExamAttemptFindAllQueryDtoFilters {
  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => {
    const isTrue = value === 'true';
    const isFalse = value === 'false';

    if (isTrue) {
      return true;
    }

    if (isFalse) {
      return false;
    }

    return value;
  })
  @IsBoolean()
  isPassed?: boolean;
}

const mockExamAttemptFindAllQueryDtoSortByOptions = [
  'isPassed',
  'score',
  'attemptDate',
] as const;
const mockExamAttemptFindAllQueryDtoSortOrderOptions = ['asc', 'desc'] as const;

export class MockExamAttemptFindAllQueryDto {
  @ApiProperty({
    required: false,
    enum: mockExamAttemptFindAllQueryDtoSortByOptions,
  })
  @IsOptional()
  @IsIn(mockExamAttemptFindAllQueryDtoSortByOptions)
  sortBy?: typeof mockExamAttemptFindAllQueryDtoSortByOptions[number];

  @ApiProperty({
    required: false,
    enum: mockExamAttemptFindAllQueryDtoSortOrderOptions,
  })
  @IsOptional()
  @IsIn(mockExamAttemptFindAllQueryDtoSortOrderOptions)
  sortOrder?: typeof mockExamAttemptFindAllQueryDtoSortOrderOptions[number];

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number;

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => MockExamAttemptFindAllQueryDtoFilters)
  filters?: MockExamAttemptFindAllQueryDtoFilters;
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
