import { Flatten } from '../utils/Flatten';

interface Configuration {
  isProduction: boolean;
  port: number;
  database: {
    host: string;
    database: string;
    schema: string;
    user: string;
    password: string;
    port: number;
  };
  jwtSecret: string;
  adminPort: number;
  adminCookieSecret: string;
  adminDisableAuth: boolean;
  mailgun: {
    apiKey?: string;
    apiDomain?: string;
    domain: string;
  };
  hostname: string;
}

export type NestConfiguration = Flatten<Configuration>;

const getVariable = (key: string, defaultValue?: string) => {
  const variable = process.env[key];

  if (variable === undefined && defaultValue !== undefined) {
    return defaultValue;
  }

  if (variable === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return variable;
};

export const getConfiguration = (): Configuration => {
  const adminDisableAuth =
    getVariable('ADMIN_DISABLE_AUTH', 'false') === 'true';

  return {
    isProduction: getVariable('NODE_ENV', 'development') === 'production',
    port: Number.parseInt(process.env.PORT ?? '8080', 10),
    database: {
      host: getVariable('DATABASE_HOST'),
      database: getVariable('DATABASE_DATABASE'),
      schema: getVariable('DATABASE_SCHEMA'),
      user: getVariable('DATABASE_USER'),
      password: getVariable('DATABASE_PASSWORD'),
      port: Number.parseInt(getVariable('DATABASE_PORT'), 10),
    },
    jwtSecret: getVariable('JWT_SECRET'),
    adminPort: Number.parseInt(process.env.ADMIN_PORT ?? '8081', 10),
    adminCookieSecret: getVariable(
      'ADMIN_COOKIE_SECRET',
      // Setting the default value only if the auth is disabled
      // to make it only required when auth is enabled
      adminDisableAuth ? '' : undefined,
    ),
    adminDisableAuth,
    mailgun: {
      apiKey: process.env.MAILGUN_API_KEY,
      apiDomain: process.env.MAILGUN_API_DOMAIN,
      domain: getVariable('MAILGUN_DOMAIN', 'localhost'),
    },
    hostname: getVariable('SERVER_HOSTNAME'),
  };
};
