import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  GetMyLessonsQueryDTO,
  GetMyLessonsResponseDTO,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { CurrentUserService } from 'current-user/current-user.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @Get()
  @ApiResponse({
    type: GetMyLessonsResponseDTO,
  })
  @Roles(UserRole.Trainee)
  async getMyLessons(
    @Query() query: GetMyLessonsQueryDTO,
  ): Promise<GetMyLessonsResponseDTO> {
    const from = query.from ?? startOfWeek(new Date());
    const to = query.to ?? endOfWeek(new Date());

    const currentUser = this.currentUserService.getRequestCurrentUser();

    const lessons = await this.lessonsService.findAllByTrainee(
      currentUser.userId,
      from,
      to,
    );

    return {
      lessons,
    };
  }
}
