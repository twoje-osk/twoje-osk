import { ApiProperty } from '@nestjs/swagger';
import { TraineeDto } from '../trainee/trainee.dto';

export class CourseReportDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  trainee: TraineeDto;

  // @ApiProperty()
  // report: ReportDto;
}
