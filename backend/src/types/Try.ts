interface Success<Data> {
  ok: true;
  data: Data;
}

interface Failure<ErrorData> {
  ok: false;
  error: ErrorData;
}

export type Try<Data, ErrorData> = Success<Data> | Failure<ErrorData>;

export function getFailure<T>(error: T) {
  return {
    ok: false as const,
    error,
  };
}

export function getSuccess<T>(data: T) {
  return {
    ok: true as const,
    data,
  };
}
