import { ResetPasswordRequestDto, ResetPasswordResponseDto } from '@osk/shared';
import { Try } from '../../types/Try';
import { logError } from '../../utils/log';
import { makeRequest } from '../../utils/makeRequest';

interface SendResetRequestError {
  type: 'TOKEN_NOT_FOUND' | 'GENERIC';
  message: string;
}

export const sendChangePasswordRequest = async (
  password: string,
  token: string,
): Promise<Try<ResetPasswordResponseDto, SendResetRequestError>> => {
  const requestBody: ResetPasswordRequestDto = {
    token,
    password,
  };

  const response = await makeRequest<
    ResetPasswordResponseDto,
    ResetPasswordRequestDto
  >('/api/reset-password/reset', null, 'POST', requestBody);

  if (response.ok) {
    return {
      ok: true,
      data: response.data,
    };
  }

  if (response.error.status === 401) {
    return {
      ok: false,
      error: {
        type: 'TOKEN_NOT_FOUND',
        message: 'Nie znaleziono tokenu',
      },
    };
  }

  logError(response.error);

  return {
    ok: false,
    error: {
      type: 'GENERIC',
      message: 'Wystąpił błąd, spróbuj ponownie później',
    },
  };
};
