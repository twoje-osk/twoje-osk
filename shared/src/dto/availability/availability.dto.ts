import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

export class CreateAvailabilityDto {}

export class UpdateAvailabilityDto extends PartialType(CreateAvailabilityDto) {}

export class AvailabilityBatch {
  @ApiProperty()
  from: ApiDate;

  @ApiProperty()
  to: ApiDate;
}

export class InstructorPublicAvailabilityQueryDTO {
  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly from?: ApiDate;

  @ApiProperty({
    format: 'yyyy-MM-ddTHH:mm:ssZ',
    type: Date,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  readonly to?: ApiDate;
}

export class InstructorPublicAvailabilityResponseDTO {
  batches: AvailabilityBatch[];
}
