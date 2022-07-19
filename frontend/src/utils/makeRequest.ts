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

async function getErrorMessageFromResponse(response: Response) {
  try {
    const errorData = await response.json();

    if (
      Object.hasOwn(errorData, 'message') &&
      typeof errorData.message === 'string'
    ) {
      return errorData.message;
    }
    // eslint-disable-next-line no-empty
  } catch {}

  return response.statusText;
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
        error: new RequestError(
          await getErrorMessageFromResponse(response),
          response.status,
        ),
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
