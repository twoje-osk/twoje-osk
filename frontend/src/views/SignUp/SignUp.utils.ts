import {
  TraineeAddNewRequestSignupDto,
  TraineeAddNewResponseDto,
} from '@osk/shared';
import { Try } from '../../types/Try';
import { makeRequest } from '../../utils/makeRequest';
import { SignUpForm } from './SignUp.schema';

export const submitSignUp = async (
  values: SignUpForm,
): Promise<
  Try<undefined, 'UNKNOWN_ERROR' | 'EMAIL_CONFLICT' | 'CEPIK_ERROR'>
> => {
  const requestBody: TraineeAddNewRequestSignupDto = {
    trainee: {
      dateOfBirth: getDateWithoutUTCOffset(values.dateOfBirth!).toISOString(),
      pkk: values.pkk,
      driversLicenseNumber: null,
      user: {
        email: values.email,
        phoneNumber: values.phoneNumber,
        password: values.password,
      },
    },
  };

  const response = await makeRequest<
    TraineeAddNewResponseDto,
    TraineeAddNewRequestSignupDto
  >('/api/trainees/signup', null, 'POST', requestBody);

  if (response.ok) {
    return {
      ok: true,
      data: undefined,
    };
  }

  if (response.error.status === 409) {
    return {
      ok: false,
      error: 'EMAIL_CONFLICT',
    };
  }

  if (response.error.status === 422) {
    return {
      ok: false,
      error: 'CEPIK_ERROR',
    };
  }

  return {
    ok: false,
    error: 'UNKNOWN_ERROR',
  };
};

const getDateWithoutUTCOffset = (date: Date) => {
  const offset = date.getTimezoneOffset();
  const ms = date.getTime();

  return new Date(ms - offset * 60 * 1000);
};
