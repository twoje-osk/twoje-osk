import {
  PresentationPaginationArguments,
  PresentationSortArguments,
} from '../utils/presentationArguments';
import { MockExamAttemptSortField } from './mockExamAttempt.utils';

export type MockExamAttemptPresentationSortArguments =
  PresentationSortArguments<MockExamAttemptSortField>;

export interface MockExamAttemptPresentationFilterArguments {
  dateFrom?: Date;
  dateTo?: Date;
  scoreTo?: number;
  scoreFrom?: number;
  isPassed?: boolean;
}

export interface MockExamAttemptPresentationArguments {
  sort: MockExamAttemptPresentationSortArguments;
  pagination: PresentationPaginationArguments;
  filter: MockExamAttemptPresentationFilterArguments;
}
