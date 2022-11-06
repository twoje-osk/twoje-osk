import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  InstructorAvailabilityResponseDTO,
  InstructorPublicAvailabilityQueryDTO,
  InstructorPublicAvailabilityResponseDTO,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { CurrentUserService } from 'current-user/current-user.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(
    private readonly availabilityService: AvailabilityService,
    private readonly currentUserService: CurrentUserService,
  ) {}

  @ApiResponse({
    type: InstructorPublicAvailabilityResponseDTO,
  })
  @Get('instructors/:id/public')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getInstructorAvailability(
    @Query() query: InstructorPublicAvailabilityQueryDTO,
    @Param('id') instructorId: number,
  ): Promise<InstructorPublicAvailabilityResponseDTO> {
    const from = query.from ?? startOfWeek(new Date());
    const to = query.to ?? endOfWeek(new Date());

    const batches =
      await this.availabilityService.getPublicInstructorAvailability(
        instructorId,
        from,
        to,
      );

    return { batches };
  }

  @ApiResponse({
    type: InstructorAvailabilityResponseDTO,
  })
  @Get()
  @Roles(UserRole.Instructor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyAvailability(
    @Query() query: InstructorPublicAvailabilityQueryDTO,
  ): Promise<InstructorAvailabilityResponseDTO> {
    const user = this.currentUserService.getRequestCurrentUser();
    const from = query.from ?? startOfWeek(new Date());
    const to = query.to ?? endOfWeek(new Date());

    const availabilities =
      await this.availabilityService.getAvailabilitiesByInstructorUserId(
        user.userId,
        from,
        to,
      );

    return { availabilities };
  }
}
