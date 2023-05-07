import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';
import { CourseReportDto } from '../courseReport/courseReport.dto';
import { ReportEntryDto } from '../reportEntry/reportEntry.dto';

export class ReportEntryToCourseReportDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  reportEntry: ReportEntryDto;

  @ApiProperty()
  courseReport: CourseReportDto;

  @ApiProperty()
  done: boolean;

  @ApiProperty()
  mastered: boolean;
}

export class ReportEntryToCourseReportCreateOrUpdateRequestDto {
  @ApiProperty()
  @IsNumber()
  reportEntryId: number;

  @ApiProperty()
  @IsNumber()
  courseReportId: number;

  @ApiProperty()
  @IsBoolean()
  done: boolean;

  @ApiProperty()
  @IsBoolean()
  mastered: boolean;
}

export class ReportEntryToCourseReportCreateOrUpdateResponseDto {}
