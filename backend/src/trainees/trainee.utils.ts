export const TRAINEE_USER_SORT_FIELDS = [
  'email',
  'firstName',
  'lastName',
  'isActive',
  'createdAt',
  'phoneNumber',
] as const;
export type TraineeUserSortField = typeof TRAINEE_USER_SORT_FIELDS[number];

export const TRAINEE_SORT_FIELDS = [
  'pesel',
  'driversLicenseNumber',
  'pkk',
  'dateOfBirth',
] as const;
export type TraineeSortField = typeof TRAINEE_SORT_FIELDS[number];

export function isTraineeUserSortField(
  text: string,
): text is TraineeUserSortField {
  return (TRAINEE_USER_SORT_FIELDS as readonly string[]).includes(text);
}

export function isTraineeSortField(text: string): text is TraineeSortField {
  return (TRAINEE_SORT_FIELDS as readonly string[]).includes(text);
}
