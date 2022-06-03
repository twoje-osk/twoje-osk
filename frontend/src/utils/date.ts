import { format, formatISO } from 'date-fns';

export const LONG_DATE = 'dd/MM/yyyy';
export const INPUT_DATE = 'yyyy-MM-dd';

const nullableFormat = (date: Date | null, dateFormat: string) =>
  date === null ? null : format(date, dateFormat);

export const formatLong = (date: Date | null) =>
  nullableFormat(date, LONG_DATE);

export const formatInput = (date: Date | null) =>
  nullableFormat(date, INPUT_DATE);

export const formatApi = (date: Date | null) =>
  date === null ? null : formatISO(date);
