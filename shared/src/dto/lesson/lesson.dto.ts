import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { addHours, startOfHour } from 'date-fns';
import { LessonStatus } from '../../types/lesson.types';
import { IsDateAfter } from '../../validators/IsDateAfter';
import { InstructorDto } from '../instructor/instructor.dto';
import { TraineeDto } from '../trainee/trainee.dto';

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
    type: InstructorDto,
  })
  instructor: InstructorDto;

  @ApiProperty({
    type: TraineeDto,
  })
  trainee: TraineeDto;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  vehicleId: number | null;
}

export class GetMyLessonsQueryDTO {
  @ApiPropertyOptional({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  from?: ApiDate;

  @ApiPropertyOptional({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  to?: ApiDate;
}

export class GetMyLessonsResponseDTO {
  @ApiProperty({
    type: LessonsDTO,
    isArray: true,
  })
  lessons: LessonsDTO[];
}

export class GetLessonByIdResponseDTO {
  @ApiProperty()
  lesson: LessonsDTO;
}

export class CreateLessonForInstructorRequestDTO {
  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: startOfHour(new Date()).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  from: ApiDate;

  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: addHours(startOfHour(new Date()), 1).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsDateAfter('from')
  to: ApiDate;
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
  from: ApiDate;

  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: addHours(startOfHour(new Date()), 1).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsDateAfter('from')
  to: ApiDate;
}

export class UpdateLessonForInstructorResponseDTO {}

export class CancelLessonForInstructorResponseDTO {}

export class UpdateLessonRequestDTO {
  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: startOfHour(new Date()).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  from: ApiDate;

  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: addHours(startOfHour(new Date()), 1).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsDateAfter('from')
  to: ApiDate;

  @ApiProperty({
    enum: LessonStatus,
  })
  @IsEnum(LessonStatus)
  @MaxLength(255)
  status: LessonStatus;

  @ApiProperty({
    type: 'number',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  vehicleId?: number | null;
}

export class UpdateLessonResponseDTO {}

export class CreateLessonRequestDTO {
  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: startOfHour(new Date()).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  from: ApiDate;

  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    default: addHours(startOfHour(new Date()), 1).toISOString(),
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @IsDateAfter('from')
  to: ApiDate;

  @ApiProperty({
    enum: LessonStatus,
  })
  @IsEnum(LessonStatus)
  @MaxLength(255)
  status: LessonStatus;

  @IsNotEmpty()
  @IsNumber()
  traineeId: number;
}

export class CreateLessonResponseDTO {
  @ApiProperty()
  createdLessonId: number;
}
