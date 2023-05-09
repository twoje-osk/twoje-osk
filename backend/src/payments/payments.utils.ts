export const PAYMENT_SORT_FIELDS = [
  'amount',
  'note',
  'date',
  'firstName',
  'lastName',
] as const;
export type PaymentSortField = typeof PAYMENT_SORT_FIELDS[number];

export function isPaymentSortField(text: string): text is PaymentSortField {
  return (PAYMENT_SORT_FIELDS as readonly string[]).includes(text);
}
