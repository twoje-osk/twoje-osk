import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class CreateAvailabilityDto {}

export class UpdateAvailabilityDto extends PartialType(CreateAvailabilityDto) {}

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
