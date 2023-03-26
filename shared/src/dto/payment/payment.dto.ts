import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

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

export class PaymentCreateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: ApiDate;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  traineeId: number;
}

export class PaymentUpdateRequestDto extends OmitType(
  PartialType(PaymentCreateRequestDto),
  ['traineeId'],
) {}

export class PaymentFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: PaymentDto,
  })
  payments: PaymentDto[];
}

export class PaymentFindAllByTraineeResponseDto {
  @ApiProperty({
    isArray: true,
    type: PaymentDto,
  })
  payments: PaymentDto[];
}

export class PaymentFindOneResponseDto {
  @ApiProperty({
    type: PaymentDto,
  })
  payment: PaymentDto;
}

export class PaymentUpdateResponseDto {}
