import { AdminModuleOptions } from '@adminjs/nestjs';
import { ResourceWithOptions } from 'adminjs';
import { ADMIN_ACCOUNT } from './admin.constants';

export function optionsWithAuth(disabled: boolean, cookiePassword: string) {
  return (config: AdminModuleOptions): AdminModuleOptions => {
    if (disabled) {
      return config;
    }

    return {
      ...config,
      auth: {
        cookieName: 'adminjs',
        cookiePassword,
        authenticate: async (email, password) => {
          if (
            ADMIN_ACCOUNT.email !== email ||
            ADMIN_ACCOUNT.password !== password
          ) {
            return null;
          }
          return ADMIN_ACCOUNT;
        },
      },
    };
  };
}

export function withCustomResourceOptions(
  resources: unknown[],
  options: ResourceWithOptions[],
) {
  const overwrittenEntities = options.map(({ resource }) => resource);

  const filteredResources = resources
    .filter((entity) => !overwrittenEntities.includes(entity))
    .map(
      (resource): ResourceWithOptions => ({
        resource,
        options: {},
      }),
    );

  return [...filteredResources, ...options].map((resource) => ({
    ...resource,
    options: {
      ...(resource.options ?? {}),
      navigation: null,
    },
  }));
}
