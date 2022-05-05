import { LoginAuthRequestDto, LoginAuthResponseDto } from '@osk/shared';
import * as Yup from 'yup';

export const LoginFormSchema = Yup.object().shape({
  email: Yup.string().required(),
  password: Yup.string().required(),
});

interface Success<T> {
  ok: true;
  data: T;
}

interface Failure {
  ok: false;
  error: string;
}

type Authenticate<T> = Success<T> | Failure;

export const authenticate = async (
  email: string,
  password: string,
): Promise<Authenticate<{ accessToken: string }>> => {
  const requestBody: LoginAuthRequestDto = {
    email,
    password,
  };

  const response = await fetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });

  if (response.status === 401) {
    return {
      ok: false,
      error: 'Błędny email lub hasło',
    };
  }

  if (!response.ok) {
    return {
      ok: false,
      error: 'Wystąpił błąd, spróbuj ponownie później',
    };
  }

  const responseBody = (await response.json()) as LoginAuthResponseDto;

  return {
    ok: true,
    data: responseBody,
  };
};
