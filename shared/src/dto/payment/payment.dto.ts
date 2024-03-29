import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { TraineeDto } from '../trainee/trainee.dto';

export class PaymentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  note: string;

  @ApiProperty()
  date: ApiDate;
}

export class PaymentWithTraineeDto extends PaymentDto {
  @ApiProperty()
  trainee: TraineeDto;
}

export class PaymentCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Max(100000.0)
  @Min(-100000.0)
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: ApiDate;

  @ApiProperty()
  @IsString()
  @MaxLength(256)
  note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  idTrainee: number;
}

export class PaymentUpdateRequestDto extends OmitType(
  PartialType(PaymentCreateRequestDto),
  ['idTrainee'],
) {}

export class PaymentFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: PaymentWithTraineeDto,
  })
  payments: PaymentWithTraineeDto[];

  @ApiProperty()
  total: number;
}

export class PaymentMyFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: PaymentWithTraineeDto,
  })
  payments: PaymentDto[];

  @ApiProperty()
  total: number;
}

export class PaymentFindAllByTraineeResponseDto {
  @ApiProperty({
    isArray: true,
    type: PaymentDto,
  })
  payments: PaymentDto[];

  @ApiProperty()
  total: number;
}

export class PaymentFindAllQueryDtoFilters {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    if (value === undefined) {
      return undefined;
    }

    const parsedValue = Number.parseInt(value, 10);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  })
  amountFrom?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Transform(({ value }) => {
    if (value === undefined) {
      return undefined;
    }

    const parsedValue = Number.parseInt(value, 10);
    return Number.isNaN(parsedValue) ? undefined : parsedValue;
  })
  amountTo?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: ApiDate;

  @ApiProperty({
    type: 'string',
    format: 'YYYY-mm-DDTHH:mm:ss.SZ',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateTo?: ApiDate;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  lastName?: string;
}

const paymentFindAllQueryDtoSortByOptions = [
  'amount',
  'note',
  'date',
  'firstName',
  'lastName',
] as const;
const paymentFindAllQueryDtoSortOrderOptions = ['asc', 'desc'] as const;

export class PaymentFindAllQueryDto {
  @ApiProperty({ required: false, enum: paymentFindAllQueryDtoSortByOptions })
  @IsOptional()
  @IsIn(paymentFindAllQueryDtoSortByOptions)
  sortBy?: typeof paymentFindAllQueryDtoSortByOptions[number];

  @ApiProperty({
    required: false,
    enum: paymentFindAllQueryDtoSortOrderOptions,
  })
  @IsOptional()
  @IsIn(paymentFindAllQueryDtoSortOrderOptions)
  sortOrder?: typeof paymentFindAllQueryDtoSortOrderOptions[number];

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

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentFindAllQueryDtoFilters)
  filters?: PaymentFindAllQueryDtoFilters;
}

export class PaymentMyFindOneResponseDto {
  @ApiProperty({
    type: PaymentDto,
  })
  payment: PaymentDto;
}

export class PaymentFindOneResponseDto {
  @ApiProperty({
    type: PaymentWithTraineeDto,
  })
  payment: PaymentWithTraineeDto;
}

export class PaymentCreateResponseDto {
  @ApiProperty({
    type: PaymentWithTraineeDto,
  })
  payment: PaymentWithTraineeDto;
}

export class PaymentUpdateResponseDto {}

export class PaymentDeleteResponseDto {}
