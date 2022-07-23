import passwordsFeature from '@adminjs/passwords';
import * as bcrypt from 'bcrypt';
import { CurrentAdmin, ResourceWithOptions } from 'adminjs';
import { User } from 'users/entities/user.entity.admin';
import { Instructor } from 'instructors/entities/instructor.entity.admin';
import { Trainee } from 'trainees/entities/trainee.entity.admin';
import { Vehicle } from 'vehicles/entities/vehicle.entity.admin';

export const ADMIN_ACCOUNT: CurrentAdmin = {
  email: 'super@example.com',
  password: 'password',
};

export const RESOURCE_OVERRIDES: ResourceWithOptions[] = [
  {
    resource: User,
    options: {},
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
