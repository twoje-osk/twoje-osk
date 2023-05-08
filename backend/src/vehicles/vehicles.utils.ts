export const VEHICLE_SORT_FIELDS = [
  'name',
  'licensePlate',
  'vin',
  'dateOfNextCheck',
  'additionalDetails',
  'notes',
] as const;
export type VehicleSortField = typeof VEHICLE_SORT_FIELDS[number];

export function isVehicleSortField(text: string): text is VehicleSortField {
  return (VEHICLE_SORT_FIELDS as readonly string[]).includes(text);
}
