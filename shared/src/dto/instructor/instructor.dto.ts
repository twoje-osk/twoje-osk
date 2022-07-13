import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DtoCreateUser, DtoUser } from '../user/user.dto';

export class DtoInstructor {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  user: DtoUser;

  @ApiProperty({ nullable: true })
  photo: string | null;
}

export class DtoCreateInstructor {
  @ApiProperty()
  user: Partial<DtoCreateUser>;

  @ApiProperty({ nullable: true })
  photo: string | null;
}

export class DtoUpdateInstructor extends PartialType(DtoCreateInstructor) {}

export class InstructorFindAllResponseDto {
  @ApiProperty({
    isArray: true,
    type: DtoInstructor,
  })
  instructors: DtoInstructor[];
}

export class InstructorFindOneResponseDto {
  @ApiProperty()
  instructor: DtoInstructor;
}

export class InstructorUpdateRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  instructor: DtoUpdateInstructor;
}

export class InstructorUpdateResponseDto {
  @ApiProperty()
  instructor: DtoInstructor;
}
