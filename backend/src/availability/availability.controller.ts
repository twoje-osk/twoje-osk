import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import {
  InstructorAvailabilityResponseDTO,
  InstructorCreateAvailabilityRequestDTO,
  InstructorCreateAvailabilityResponseDTO,
  InstructorPublicAvailabilityQueryDTO,
  InstructorPublicAvailabilityResponseDTO,
  InstructorUpdateAvailabilityRequestDTO,
  InstructorUpdateAvailabilityResponseDTO,
  InstructorDeleteAvailabilityResponseDTO,
  UserRole,
} from '@osk/shared';
import { Roles } from 'common/guards/roles.decorator';
import { CurrentUserService } from 'current-user/current-user.service';
import { endOfWeek, startOfWeek } from 'date-fns';
import { assertNever } from 'utils/assertNever';
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
    @Param('id', ParseIntPipe) instructorId: number,
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

  @ApiResponse({
    type: InstructorCreateAvailabilityResponseDTO,
  })
  @Post()
  @Roles(UserRole.Instructor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAvailability(
    @Body() body: InstructorCreateAvailabilityRequestDTO,
  ): Promise<InstructorCreateAvailabilityResponseDTO> {
    const { from, to } = body.availability;

    const newAvailability = await this.availabilityService.createAvailability(
      from,
      to,
    );

    if (newAvailability.ok) {
      return { createdAvailabilityId: newAvailability.data };
    }

    if (newAvailability.error === 'INSTRUCTOR_NOT_FOUND') {
      throw new NotFoundException(
        "Instructor for the current user doesn't exist",
      );
    }

    if (newAvailability.error === 'COLLIDING_AVAILABILITY') {
      throw new ConflictException(
        'There is availability already in that time slot',
      );
    }

    return assertNever(newAvailability.error);
  }

  @ApiResponse({
    type: InstructorUpdateAvailabilityResponseDTO,
  })
  @Patch(':id')
  @Roles(UserRole.Instructor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateAvailability(
    @Body() body: InstructorUpdateAvailabilityRequestDTO,
    @Param('id', ParseIntPipe) instructorId: number,
  ): Promise<InstructorUpdateAvailabilityResponseDTO> {
    const { from, to } = body.availability;

    const newAvailability = await this.availabilityService.updateAvailability(
      instructorId,
      from,
      to,
    );

    if (newAvailability.ok) {
      return {};
    }

    if (newAvailability.error === 'INSTRUCTOR_NOT_FOUND') {
      throw new NotFoundException(
        "Instructor for the current user doesn't exist",
      );
    }

    if (newAvailability.error === 'AVAILABILITY_NOT_FOUND') {
      throw new NotFoundException('Specified availability was not found');
    }

    if (newAvailability.error === 'COLLIDING_AVAILABILITY') {
      throw new ConflictException(
        'There is availability already in that time slot',
      );
    }

    return assertNever(newAvailability.error);
  }

  @ApiResponse({
    type: InstructorDeleteAvailabilityResponseDTO,
  })
  @Delete(':id')
  @Roles(UserRole.Instructor)
  @UsePipes(new ValidationPipe({ transform: true }))
  async deleteAvailability(
    @Param('id', ParseIntPipe) instructorId: number,
  ): Promise<InstructorDeleteAvailabilityResponseDTO> {
    const newAvailability = await this.availabilityService.deleteAvailability(
      instructorId,
    );

    if (newAvailability.ok) {
      return {};
    }

    if (newAvailability.error === 'INSTRUCTOR_NOT_FOUND') {
      throw new NotFoundException(
        "Instructor for the current user doesn't exist",
      );
    }

    if (newAvailability.error === 'AVAILABILITY_NOT_FOUND') {
      throw new NotFoundException('Specified availability was not found');
    }

    return assertNever(newAvailability.error);
  }
}
