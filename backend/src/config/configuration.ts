interface Configuration {
  port: number;
  database: {
    host: string;
    database: string;
    schema: string;
    user: string;
    password: string;
    port: number;
  };
}

const getVariable = (env: typeof process.env, key: string) => {
  const variable = env[key];

  if (variable === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }

  return variable;
};

export const getConfiguration = (): Configuration => {
  return {
    port: Number.parseInt(process.env.PORT ?? '8080', 10),
    database: {
      host: getVariable(process.env, 'DATABASE_HOST'),
      database: getVariable(process.env, 'DATABASE_DATABASE'),
      schema: getVariable(process.env, 'DATABASE_SCHEMA'),
      user: getVariable(process.env, 'DATABASE_USER'),
      password: getVariable(process.env, 'DATABASE_PASSWORD'),
      port: Number.parseInt(getVariable(process.env, 'DATABASE_PORT'), 10),
    },
  };
};
