import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  AnnouncementCreateRequestDto,
  AnnouncementCreateResponseDto,
  AnnouncementDeleteResponseDto,
  AnnouncementFindAllResponseDto,
  AnnouncementFindOneResponseDto,
  AnnouncementUpdateRequestDto,
  AnnouncementUpdateResponseDto,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { assertNever } from 'utils/assertNever';
import { AnnouncementsService } from './announcement.service';

@Roles(UserRole.Admin)
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Roles(UserRole.Trainee, UserRole.Instructor, UserRole.Admin)
  @ApiResponse({
    type: AnnouncementFindAllResponseDto,
  })
  @Get()
  async findAll(): Promise<AnnouncementFindAllResponseDto> {
    const announcements = await this.announcementsService.findAll();
    return { announcements };
  }

  @ApiResponse({
    type: AnnouncementFindOneResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AnnouncementFindOneResponseDto> {
    const announcement = await this.announcementsService.findOne(id);
    if (announcement === null) {
      throw new NotFoundException();
    }

    return { announcement };
  }

  @ApiResponse({
    type: AnnouncementCreateResponseDto,
  })
  @Post()
  async create(
    @Body() { announcement }: AnnouncementCreateRequestDto,
  ): Promise<AnnouncementCreateResponseDto> {
    const createdId = await this.announcementsService.create(announcement);
    return { id: createdId };
  }

  @ApiResponse({
    type: AnnouncementUpdateResponseDto,
  })
  @Patch(':id')
  async update(
    @Body() { announcement }: AnnouncementUpdateRequestDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AnnouncementUpdateResponseDto> {
    const updateResult = await this.announcementsService.update(
      announcement,
      id,
    );
    if (updateResult.ok === true) {
      return { id: updateResult.data };
    }
    if (updateResult.error === 'NO_SUCH_ANNOUNCEMENT') {
      throw new NotFoundException('There is no announcement with this id');
    }
    return assertNever(updateResult.error);
  }

  @ApiResponse({
    type: AnnouncementDeleteResponseDto,
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AnnouncementDeleteResponseDto> {
    const deleteResult = await this.announcementsService.delete(id);
    if (deleteResult.ok === true) {
      return { announcement: deleteResult.data };
    }
    if (deleteResult.error === 'ANNOUNCEMENT_NOT_FOUND') {
      throw new NotFoundException('There is no announcement with this id');
    }

    return assertNever(deleteResult.error);
  }
}
