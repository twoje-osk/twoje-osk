import { UserArguments } from '../types/UserArguments';
import {
  PresentationPaginationArguments,
  PresentationSortArguments,
} from '../utils/presentationArguments';
import { InstructorUserSortField } from './instructors.utils';

export interface InstructorFields {
  user: UserArguments;
  registrationNumber: string;
  licenseNumber: string;
  instructorsQualificationsIds: number[];
  photo: string | null;
}

export interface InstructorUpdateFields
  extends Partial<Omit<InstructorFields, 'user'>> {
  user?: Partial<UserArguments>;
}

export type InstructorPresentationSortArguments =
  PresentationSortArguments<InstructorUserSortField>;

export interface InstructorPresentationFilterArguments {
  searchedPhrase?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  isActive?: boolean;
  instructorQualification?: number;
}

export interface InstructorPresentationArguments {
  sort: InstructorPresentationSortArguments;
  pagination: PresentationPaginationArguments;
  filter: InstructorPresentationFilterArguments;
}
