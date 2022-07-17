import { Flatten } from '../utils/Flatten';

interface Configuration {
  isProduction: boolean;
  port: number;
  adminPort: number;
  database: {
    host: string;
    database: string;
    schema: string;
    user: string;
    password: string;
    port: number;
  };
  jwtSecret: string;
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
  return {
    isProduction: getVariable('NODE_ENV', 'development') === 'production',
    port: Number.parseInt(process.env.PORT ?? '8080', 10),
    adminPort: Number.parseInt(process.env.ADMIN_PORT ?? '8081', 10),
    database: {
      host: getVariable('DATABASE_HOST'),
      database: getVariable('DATABASE_DATABASE'),
      schema: getVariable('DATABASE_SCHEMA'),
      user: getVariable('DATABASE_USER'),
      password: getVariable('DATABASE_PASSWORD'),
      port: Number.parseInt(getVariable('DATABASE_PORT'), 10),
    },
    jwtSecret: getVariable('JWT_SECRET'),
  };
};
