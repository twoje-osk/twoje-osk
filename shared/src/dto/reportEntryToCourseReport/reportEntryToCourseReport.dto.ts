import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CourseReportDto } from '../courseReport/courseReport.dto';
import { ReportEntryDto } from '../reportEntry/reportEntry.dto';

export class ReportEntryToCourseReportDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @Type(() => ReportEntryDto)
  reportEntry: ReportEntryDto;

  @ApiProperty()
  @Type(() => CourseReportDto)
  courseReport: CourseReportDto;

  @ApiProperty()
  @IsBoolean()
  done: boolean;

  @ApiProperty()
  @IsBoolean()
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
