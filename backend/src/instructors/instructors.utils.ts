export const INSTRUCTOR_USER_SORT_FIELDS = [
  'firstName',
  'lastName',
  'isActive',
] as const;
export type InstructorUserSortField =
  typeof INSTRUCTOR_USER_SORT_FIELDS[number];

export function isInstructorUserSortField(
  text: string,
): text is InstructorUserSortField {
  return (INSTRUCTOR_USER_SORT_FIELDS as readonly string[]).includes(text);
}

export function escapeForbiddenCharsFromFilter(text: string): string {
  return text.replace(/[\\%_]/g, (match) => `\\${match}`);
}
