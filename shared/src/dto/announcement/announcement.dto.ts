import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
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

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}

export class AnnouncementFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: AnnouncementDto,
  })
  @ValidateNested()
  @Type(() => AnnouncementDto)
  announcements: AnnouncementDto[];

  @ApiProperty()
  total: number;
}

export class AnnouncementFindAllQueryDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  pageSize?: number;
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
  @Type(() => UpdateAnnouncementDto)
  announcement: UpdateAnnouncementDto;
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
