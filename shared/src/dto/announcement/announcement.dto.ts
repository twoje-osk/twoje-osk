import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UserDto } from '../user/user.dto';

export class AnnouncementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserDto)
  createdBy: UserDto;

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

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  body: string;
}

export class DtoUpdateAnnouncement extends PartialType(CreateAnnouncementDto) {}

export class AnnouncementFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: AnnouncementDto,
  })
  @ValidateNested()
  @Type(() => AnnouncementDto)
  announcements: AnnouncementDto[];
}

export class AnnouncementFindOneResponseDto {
  @ValidateNested()
  @ApiProperty()
  announcement: AnnouncementDto;
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
  @Type(() => CreateAnnouncementDto)
  announcement: CreateAnnouncementDto;
}

export class AnnouncementCreateResponseDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}

export class AnnouncementDeleteResponseDto {}
