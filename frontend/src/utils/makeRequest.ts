import { Try } from '../types/Try';

const getHeaders = (token: string | null, isResponseBodyPresent: boolean) => {
  const baseHeaders: HeadersInit = isResponseBodyPresent
    ? {
        'Content-Type': 'application/json',
      }
    : {};

  if (token !== null) {
    baseHeaders.Authorization = `Bearer ${token}`;
  }

  return baseHeaders;
};

export class RequestError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
  }
}

export const makeRequest = async <ResponseDto, RequestDto = never>(
  url: string,
  token: string | null,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  requestBody?: RequestDto,
): Promise<Try<ResponseDto, RequestError>> => {
  try {
    const response = await fetch(url, {
      method,
      body: requestBody !== undefined ? JSON.stringify(requestBody) : undefined,
      headers: getHeaders(token, requestBody !== undefined),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: new RequestError(response.statusText, response.status),
      };
    }

    const data = (await response.json()) as ResponseDto;

    return {
      ok: true,
      data,
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        ok: false,
        error,
      };
    }

    return {
      ok: false,
      error: new RequestError(`An unknown error has occurred ${String(error)}`),
    };
  }
};
