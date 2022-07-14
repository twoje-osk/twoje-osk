import { Transform } from 'class-transformer';

export const ToLowerCase = () =>
  Transform(({ value }) => {
    if (typeof value !== 'string') {
      return value;
    }

    return value.toLowerCase();
  });
