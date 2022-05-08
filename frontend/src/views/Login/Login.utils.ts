import { LoginAuthRequestDto, LoginAuthResponseDto } from '@osk/shared';
import * as Yup from 'yup';
import { Try } from '../../types/Try';
import { logError } from '../../utils/log';
import { makeRequest } from '../../utils/makeRequest';

export const LoginFormSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

export const authenticate = async (
  email: string,
  password: string,
): Promise<Try<LoginAuthResponseDto, string>> => {
  const requestBody: LoginAuthRequestDto = {
    email,
    password,
  };

  const response = await makeRequest<LoginAuthResponseDto, LoginAuthRequestDto>(
    '/api/auth/login',
    null,
    'POST',
    requestBody,
  );

  if (response.ok) {
    return {
      ok: true,
      data: response.data,
    };
  }

  if (response.error.status === 401) {
    return {
      ok: false,
      error: 'Błędny email lub hasło',
    };
  }

  logError(response.error);

  return {
    ok: false,
    error: 'Wystąpił błąd, spróbuj ponownie później',
  };
};
