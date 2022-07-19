import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDate, IsOptional, Validate } from 'class-validator';
import { addHours, startOfHour } from 'date-fns';
import { LessonStatus } from '../../types/lesson.types';
import { DtoInstructor } from '../instructor/instructor.dto';
import { IsToGreaterThenFrom } from './lesson.validators';

export class LessonsDTO {
  @ApiProperty()
  id: number;

  @ApiProperty({
    type: 'string',
  })
  from: ApiDate;

  @ApiProperty({
    type: 'string',
  })
  to: ApiDate;

  @ApiProperty()
  status: LessonStatus;

  @ApiProperty({
    type: DtoInstructor,
  })
  instructor: DtoInstructor;
}

export class GetMyLessonsQueryDTO {
  @ApiPropertyOptional({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly from?: ApiDate;

  @ApiPropertyOptional({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly to?: ApiDate;
}

export class GetMyLessonsResponseDTO {
  @ApiProperty({
    type: LessonsDTO,
    isArray: true,
  })
  lessons: LessonsDTO[];
}

export class CreateLessonForInstructorRequestDTO {
  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: startOfHour(new Date()).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  readonly from: ApiDate;

  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: addHours(startOfHour(new Date()), 1).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @Validate(IsToGreaterThenFrom, ['from'])
  readonly to: ApiDate;
}

export class CreateLessonForInstructorResponseDTO {
  @ApiProperty()
  createdLessonId: number;
}

export class UpdateLessonForInstructorRequestDTO {
  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: startOfHour(new Date()).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  readonly from: ApiDate;

  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: addHours(startOfHour(new Date()), 1).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @Validate(IsToGreaterThenFrom, ['from'])
  readonly to: ApiDate;
}

export class UpdateLessonForInstructorResponseDTO {}

export class CancelLessonForInstructorResponseDTO {}
