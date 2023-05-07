import { ApiProperty } from '@nestjs/swagger';

export class LectureDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  index: number;
}

export class FullLectureDto extends LectureDto {
  @ApiProperty()
  body: string;
}

export class LectureFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: LectureDto,
  })
  lectures: LectureDto[];
}

export class LectureFindOneResponseDto {
  @ApiProperty()
  lecture: FullLectureDto;
}
