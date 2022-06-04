import { ApiProperty } from '@nestjs/swagger';
import { DtoUser } from '../user/user.dto';

export class DtoInstructor {
  @ApiProperty()
  id: number;

  @ApiProperty()
  user: DtoUser;
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
