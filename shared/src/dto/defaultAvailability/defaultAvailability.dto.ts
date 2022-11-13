import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, ValidateNested } from 'class-validator';
import { Time } from '../../types/Time';
import { IsTime } from '../../validators/IsTime';
import { IsTimeAfter } from '../../validators/IsTimeAfter';
import { DtoInstructor } from '../instructor/instructor.dto';

export class DtoDefaultAvailability {
  @ApiProperty()
  id: number;

  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  instructor: DtoInstructor;
}

export class DtoCreateDefaultAvailability {
  @ApiProperty({
    type: Time,
    default: new Time(9, 0, 0),
  })
  @Type(() => Time)
  @IsTime()
  from: ApiTime;

  @ApiProperty({
    type: Time,
    default: new Time(17, 0, 0),
  })
  @Type(() => Time)
  @IsTime()
  @IsTimeAfter('from')
  to: ApiTime;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  dayOfWeek: number;
}

export class DtoUpdateDefaultAvailability extends PartialType(
  DtoCreateDefaultAvailability,
) {}

export class DefaultAvailabilityBatch {
  @ApiProperty({
    type: Time,
  })
  from: ApiTime;

  @ApiProperty({
    type: Time,
  })
  to: ApiTime;
}

export class DefaultAvailabilityDTO {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({
    type: Time,
    default: new Time(9, 0, 0),
  })
  from: ApiTime;

  @ApiProperty({
    type: Time,
    default: new Time(17, 0, 0),
  })
  to: ApiTime;

  @ApiProperty({ type: 'number' })
  @IsNumber()
  dayOfWeek: number;
}
export class InstructorDefaultAvailabilityResponseDTO {
  @ApiProperty({
    isArray: true,
    type: DefaultAvailabilityDTO,
  })
  availabilities: DefaultAvailabilityDTO[];
}

export class InstructorCreateDefaultAvailabilityRequestDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => DtoCreateDefaultAvailability)
  availability: DtoCreateDefaultAvailability;
}

export class InstructorCreateDefaultAvailabilityResponseDTO {
  @ApiProperty()
  createdAvailabilityId: number;
}

export class InstructorUpdateDefaultAvailabilityRequestDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => DtoUpdateDefaultAvailability)
  availability: DtoUpdateDefaultAvailability;
}

export class InstructorUpdateDefaultAvailabilityResponseDTO {}

export class InstructorDeleteDefaultAvailabilityResponseDTO {}
