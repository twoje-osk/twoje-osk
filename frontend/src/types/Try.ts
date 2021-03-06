interface Success<Data> {
  ok: true;
  data: Data;
}

interface Failure<ErrorData> {
  ok: false;
  error: ErrorData;
}

export type Try<Data, ErrorData = Error> = Success<Data> | Failure<ErrorData>;
