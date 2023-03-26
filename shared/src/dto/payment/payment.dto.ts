import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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
  amount: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  date: ApiDate;

  @ApiProperty()
  @IsString()
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
}

export class PaymentMyFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: PaymentWithTraineeDto,
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
