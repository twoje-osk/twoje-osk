import passwordsFeature from '@adminjs/passwords';
import * as bcrypt from 'bcrypt';
import { CurrentAdmin, ResourceWithOptions } from 'adminjs';
// @ts-ignore
import { User, Instructor, Trainee, Vehicle } from './admin.imports';

export const ADMIN_ACCOUNT: CurrentAdmin = {
  email: 'super@example.com',
  password: 'password',
};

export const RESOURCE_OVERRIDES: ResourceWithOptions[] = [
  {
    resource: User,
    options: {
      properties: {
        traineeId: {
          isDisabled: true,
        },
        instructorId: {
          isDisabled: true,
        },
      },
    },
    features: [
      passwordsFeature({
        properties: {
          encryptedPassword: 'password',
        },
        hash: (password) => bcrypt.hashSync(password, 10),
      }),
    ],
  },
  {
    resource: Instructor,
    options: {
      properties: {
        userId: {
          isDisabled: true,
          reference: 'User',
        },
      },
    },
  },
  {
    resource: Trainee,
    options: {
      properties: {
        userId: {
          isDisabled: true,
          reference: 'User',
        },
      },
    },
  },
  {
    resource: Vehicle,
    options: {
      properties: {
        organizationId: {
          isDisabled: true,
          reference: 'Organization',
        },
      },
    },
  },
];
