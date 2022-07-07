import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import { DtoInstructor } from '../instructor/instructor.dto';

export enum LessonStatus {
  Requested = 'Requested',
  Accepted = 'Accepted',
  Canceled = 'Canceled',
  Finished = 'Finished',
}

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
