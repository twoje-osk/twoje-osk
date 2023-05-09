import { Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';

export const DateBetweenProperty = (
  from: Date | undefined,
  to: Date | undefined,
) => {
  if (from !== undefined && to !== undefined) {
    return Between(from, to);
  }
  if (from !== undefined && to === undefined) {
    return MoreThanOrEqual(from);
  }
  if (from === undefined && to !== undefined) {
    return LessThanOrEqual(to);
  }
  return undefined;
};
