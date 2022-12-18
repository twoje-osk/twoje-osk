import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';
import { setHours, startOfHour } from 'date-fns';
import { IsDateAfter } from '../../validators/IsDateAfter';
import { InstructorDto } from '../instructor/instructor.dto';

export class AvailabilityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  from: ApiDate;

  @ApiProperty()
  to: ApiDate;

  @ApiProperty()
  instructor: InstructorDto;
}

export class DtoCreateAvailability {
  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
    default: setHours(startOfHour(new Date()), 9).toISOString(),
  })
  @Type(() => Date)
  @IsDate()
  from: ApiDate;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
    default: setHours(startOfHour(new Date()), 17).toISOString(),
  })
  @Type(() => Date)
  @IsDate()
  @IsDateAfter('from')
  to: ApiDate;
}

export class DtoUpdateAvailability extends PartialType(DtoCreateAvailability) {}

export class AvailabilityBatch {
  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  from: ApiDate;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  to: ApiDate;
}

export class InstructorPublicAvailabilityQueryDTO {
  @ApiPropertyOptional({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly from?: ApiDate;

  @ApiPropertyOptional({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly to?: ApiDate;
}

export class InstructorPublicAvailabilityResponseDTO {
  @ApiProperty({
    isArray: true,
    type: AvailabilityBatch,
  })
  batches: AvailabilityBatch[];
}

export class AvailabilityDTO {
  @ApiProperty({ type: 'number' })
  id: number;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  from: ApiDate;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
  })
  to: ApiDate;
}
export class InstructorAvailabilityResponseDTO {
  @ApiProperty({
    isArray: true,
    type: AvailabilityDTO,
  })
  availabilities: AvailabilityDTO[];
}

export class InstructorCreateAvailabilityRequestDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => DtoCreateAvailability)
  availability: DtoCreateAvailability;
}

export class InstructorCreateAvailabilityResponseDTO {
  @ApiProperty()
  createdAvailabilityId: number;
}

export class InstructorUpdateAvailabilityRequestDTO {
  @ApiProperty()
  @ValidateNested()
  @Type(() => DtoUpdateAvailability)
  availability: DtoUpdateAvailability;
}

export class InstructorUpdateAvailabilityResponseDTO {}

export class InstructorDeleteAvailabilityResponseDTO {}
