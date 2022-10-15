import {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
} from '@osk/shared';
import { Try } from '../../types/Try';
import { logError } from '../../utils/log';
import { makeRequest } from '../../utils/makeRequest';

export const sendResetRequest = async (
  email: string,
): Promise<Try<ForgotPasswordResponseDto, string>> => {
  const requestBody: ForgotPasswordRequestDto = {
    email,
  };

  const response = await makeRequest<
    ForgotPasswordResponseDto,
    ForgotPasswordRequestDto
  >('/api/reset-password/forgot', null, 'POST', requestBody);

  if (response.ok) {
    return {
      ok: true,
      data: response.data,
    };
  }

  logError(response.error);

  return {
    ok: false,
    error: 'Wystąpił błąd, spróbuj ponownie później',
  };
};
