import { ApiProperty } from '@nestjs/swagger';
import { DtoUser } from '../user/user.dto';

export class DtoInstructor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: DtoUser;

  @ApiProperty({ nullable: true })
  photo: string | null;
}

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
  instructor: Partial<DtoInstructor>;
}

export class InstructorUpdateResponseDto {
  @ApiProperty()
  instructorId: number;
}
