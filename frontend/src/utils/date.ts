import { format, formatISO, Locale } from 'date-fns';
import { pl } from 'date-fns/locale';
import { assertNever } from './asserNever';

export const LONG_DATE = 'dd/MM/yyyy';
export const VERY_LONG_DATE = 'dd MMMM yyyy';
export const INPUT_DATE = 'yyyy-MM-dd';
export const INPUT_DATETIME = "yyyy-MM-dd'T'HH:mm";
export const TIME = 'HH:mm';

const nullableFormat = (
  date: Date | null,
  dateFormat: string,
  locale?: Locale,
) => (date === null ? null : format(date, dateFormat, { locale }));

export const formatTime = (date: Date | null) => nullableFormat(date, TIME);

export const formatLong = (date: Date | null) =>
  nullableFormat(date, LONG_DATE);

export const formatVeryLongDate = (date: Date | null) =>
  nullableFormat(date, VERY_LONG_DATE, pl);

export function getFormatForInputType(
  type: 'date' | 'datetime-local' | 'time',
) {
  if (type === 'date') {
    return INPUT_DATE;
  }

  if (type === 'datetime-local') {
    return INPUT_DATETIME;
  }

  if (type === 'time') {
    return TIME;
  }

  return assertNever(type);
}

export const formatInput = (
  date: Date | null,
  type: 'date' | 'datetime-local' | 'time',
) => {
  return nullableFormat(date, getFormatForInputType(type));
};

export function formatApi(date: Date): string;
export function formatApi(date: null): null;
export function formatApi(date: Date | null) {
  return date === null ? null : formatISO(date);
}
