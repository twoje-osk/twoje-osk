import { ApiProperty } from '@nestjs/swagger';
import { ReportDto } from '../report/report.dto';
import { TraineeDto } from '../trainee/trainee.dto';

export class CourseReportDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  trainee: TraineeDto;

  @ApiProperty()
  report: ReportDto;
}

export class CourseReportEntry {
  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @ApiProperty()
  done: boolean;

  @ApiProperty()
  mastered: boolean;
}

export class CourseReportGroup {
  @ApiProperty()
  groupDescription: string;

  @ApiProperty()
  entries: CourseReportEntry[];
}

export class GetCourseReportResponseDto {
  @ApiProperty()
  courseReportId: number;

  @ApiProperty()
  report: CourseReportGroup[];
}
