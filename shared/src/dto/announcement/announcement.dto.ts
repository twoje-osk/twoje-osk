import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DtoUser } from '../user/user.dto';

export class DtoAnnouncement {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoUser)
  createdBy: DtoUser;

  @ApiProperty({
    type: 'string',
  })
  @IsNotEmpty()
  createdAt: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;
}

export class DtoCreateAnnouncement {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;
}

export class DtoUpdateAnnouncement extends PartialType(DtoCreateAnnouncement) {}

export class AnnouncementFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoAnnouncement,
  })
  @ValidateNested()
  @Type(() => DtoAnnouncement)
  announcements: DtoAnnouncement[];
}

export class AnnouncementFindOneResponseDto {
  @ValidateNested()
  @ApiProperty()
  announcement: DtoAnnouncement;
}
export class AnnouncementUpdateRequestDto {
  @ApiProperty()
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => DtoUpdateAnnouncement)
  announcement: DtoUpdateAnnouncement;
}

export class AnnouncementUpdateResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class AnnouncementCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => DtoCreateAnnouncement)
  announcement: DtoCreateAnnouncement;
}

export class AnnouncementCreateResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class AnnouncementDeleteResponseDto {}
