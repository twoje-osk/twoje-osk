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
  InstructorPublicAvailabilityQueryDTO,
  InstructorPublicAvailabilityResponseDTO,
} from '@osk/shared';
import { endOfWeek, startOfWeek } from 'date-fns';
import { AvailabilityService } from './availability.service';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

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
}
