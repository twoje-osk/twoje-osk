interface Success<Data> {
  ok: true;
  data: Data;
}

interface Failure<ErrorData> {
  ok: false;
  error: ErrorData;
}

export type Try<Data, ErrorData> = Success<Data> | Failure<ErrorData>;

export class FailureError<T> extends Error {
  constructor(public data: T) {
    super('FailureError');
  }
}

export function getFailure<T>(error: T) {
  return {
    ok: false as const,
    error,
  };
}

export function getFailureError<T>(error: T) {
  return new FailureError(error);
}

export function getSuccess<T>(data: T) {
  return {
    ok: true as const,
    data,
  };
}

const hasProperty = <T extends string>(
  value: object,
  propertyName: T,
): value is Record<T, unknown> => {
  return Object.hasOwn(value, propertyName);
};

export function isTry<Data = any, ErrorData = any>(
  data: unknown,
): data is Try<Data, ErrorData> {
  if (typeof data !== 'object' || data == null) {
    return false;
  }

  const hasOk = hasProperty(data, 'ok');
  if (!hasOk) {
    return false;
  }

  if (hasOk === true) {
    return hasProperty(data, 'data');
  }

  if (hasOk === false) {
    return hasProperty(data, 'error');
  }

  return false;
}
