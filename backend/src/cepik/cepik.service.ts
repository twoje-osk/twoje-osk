import * as faker from '@faker-js/faker/locale/pl';
import { Injectable } from '@nestjs/common';
import { Try, getFailure, getSuccess } from '../types/Try';

interface CepikResponseData {
  firstName: string;
  lastName: string;
  pesel: string | null;
  driverLicenseCategoryName: string;
}
@Injectable()
export class CepikService {
  registerUser(
    pkkNumber: string,
    dateOfBirth: Date,
  ): Try<CepikResponseData, 'CEPIK_ERROR'> {
    // Adding testing CEPIK_ERROR for testing purposes whenever
    // someone creates a new user with dateOfBirth equal to
    // 1st of January
    if (dateOfBirth.getDate() === 1 && dateOfBirth.getMonth() === 0) {
      return getFailure('CEPIK_ERROR');
    }

    return getSuccess({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      pesel: faker.datatype.boolean() ? faker.random.numeric(11) : null,
      driverLicenseCategoryName: 'B',
    });
  }
}
