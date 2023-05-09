export const MOCK_EXAM_ATTEMPT_SORT_FIELDS = [
  'isPassed',
  'score',
  'attemptDate',
] as const;
export type MockExamAttemptSortField =
  typeof MOCK_EXAM_ATTEMPT_SORT_FIELDS[number];

export function isMockExamAttemptSortField(
  text: string,
): text is MockExamAttemptSortField {
  return (MOCK_EXAM_ATTEMPT_SORT_FIELDS as readonly string[]).includes(text);
}
