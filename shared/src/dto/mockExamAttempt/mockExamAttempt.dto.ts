import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';
import { DtoCreateMockExamQuestionAttempt } from '../mockExamQuestionAttempt/mockExamQuestionAttempt.dto';
import { DtoTrainee } from '../trainee/trainee.dto';

export class DtoMockExamAttempt {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoTrainee)
  trainee: DtoTrainee;

  @ApiProperty({
    type: 'string',
  })
  attemptDate: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  questionsIds: number[];
}

export class DtoSubmitMockExamAttempt {
  @ApiProperty()
  @IsNumber()
  traineeId: number;

  @ApiProperty({ isArray: true })
  @ValidateNested()
  @Type(() => DtoCreateMockExamQuestionAttempt)
  questions: DtoCreateMockExamQuestionAttempt[];
}

export class MockExamAttemptFindAllResponseDto {
  @ApiProperty({ type: DtoMockExamAttempt, isArray: true })
  examAttempts: DtoMockExamAttempt[];
}

export class MockExamAttemptFindOneResponseDto {
  @ApiProperty({ type: DtoMockExamAttempt })
  examAttempt: DtoMockExamAttempt;
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
  @Type(() => DtoSubmitMockExamAttempt)
  instructor: DtoSubmitMockExamAttempt;
}
