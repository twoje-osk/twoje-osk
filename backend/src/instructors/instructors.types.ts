import { UserArguments } from '../types/UserArguments';

export interface InstructorFields {
  user: UserArguments;
  photo: string | null;
}

export interface InstructorUpdateFields
  extends Partial<Omit<InstructorFields, 'user'>> {
  user?: Partial<UserArguments>;
}
