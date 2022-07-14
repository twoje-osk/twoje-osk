import { Transform } from 'class-transformer';

export const ToUpperCase = () =>
  Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.toUpperCase();
  });
