import passwordsFeature from '@adminjs/passwords';
import * as argon from 'argon2';
// Adding `@ts-ignore` so that it doesn't throw an error when the admin entities aren't built
// @ts-ignore
import {
  User,
  Instructor,
  Trainee,
  Vehicle,
  MockExamAttempt,
  MockExamQuestion,
  MockExamQuestionAnswer,
  MockExamQuestionAttempt,
  MockExamQuestionsAmount,
  MockExamQuestionType,
  ResetPasswordToken,
  Lecture,
  // Adding `@ts-ignore` so that it doesn't throw an error when the admin entities aren't built
  // @ts-ignore
} from './admin.imports';
import {
  setUserSubtypeOrganizationForList,
  setUserSubtypeOrganizationForSingleElement,
  SortedResourceWithOptions,
} from './admin.utils';

const USERS_GROUP = {
  name: 'Users',
};
const MOCK_EXAM_GROUP = {
  name: 'E-Learning',
};

export const RESOURCE_OVERRIDES: SortedResourceWithOptions[] = [
  {
    order: 0,
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
      navigation: USERS_GROUP,
    },
    features: [
      passwordsFeature({
        properties: {
          encryptedPassword: 'password',
        },
        hash: (password) => argon.hash(password),
      }),
    ],
  },
  {
    resource: Instructor,
    options: {
      actions: {
        show: {
          after: setUserSubtypeOrganizationForSingleElement,
        },
        list: {
          after: setUserSubtypeOrganizationForList,
        },
      },
      properties: {
        userId: {
          isDisabled: true,
          reference: 'User',
          type: 'reference',
        },
        organization: {
          isDisabled: true,
          reference: 'Organization',
          type: 'reference',
        },
      },
      navigation: USERS_GROUP,
    },
  },
  {
    resource: Trainee,
    options: {
      actions: {
        show: {
          after: setUserSubtypeOrganizationForSingleElement,
        },
        list: {
          after: setUserSubtypeOrganizationForList,
        },
      },
      properties: {
        userId: {
          isDisabled: true,
          reference: 'User',
          type: 'reference',
        },
        organization: {
          isDisabled: true,
          reference: 'Organization',
          type: 'reference',
        },
      },
      navigation: USERS_GROUP,
    },
  },
  {
    resource: ResetPasswordToken,
    options: {
      navigation: USERS_GROUP,
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
  {
    order: 1,
    resource: MockExamAttempt,
    options: { navigation: MOCK_EXAM_GROUP },
  },
  { resource: MockExamQuestion, options: { navigation: MOCK_EXAM_GROUP } },
  { resource: MockExamQuestionType, options: { navigation: MOCK_EXAM_GROUP } },
  {
    resource: MockExamQuestionAnswer,
    options: { navigation: MOCK_EXAM_GROUP },
  },
  {
    resource: MockExamQuestionAttempt,
    options: { navigation: MOCK_EXAM_GROUP },
  },
  {
    resource: MockExamQuestionsAmount,
    options: { navigation: MOCK_EXAM_GROUP },
  },
  {
    resource: Lecture,
    options: {
      navigation: MOCK_EXAM_GROUP,
      properties: {
        body: {
          type: 'richtext',
        },
        index: {
          type: 'number',
        },
      },
    },
  },
];
