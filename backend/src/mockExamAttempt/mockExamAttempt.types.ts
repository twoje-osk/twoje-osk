import {
  PresentationPaginationArguments,
  PresentationSortArguments,
} from '../utils/presentationArguments';
import { MockExamAttemptSortField } from './mockExamAttempt.utils';

export type MockExamAttemptPresentationSortArguments =
  PresentationSortArguments<MockExamAttemptSortField>;

export interface MockExamAttemptPresentationFilterArguments {
  isPassed?: boolean;
}

export interface MockExamAttemptPresentationArguments {
  sort: MockExamAttemptPresentationSortArguments;
  pagination: PresentationPaginationArguments;
  filter: MockExamAttemptPresentationFilterArguments;
}
