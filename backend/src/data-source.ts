import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';
import { getConfiguration } from './config/configuration';

const config = getConfiguration();

const baseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.MIGRATION_DATABASE_HOST ?? config.database.host,
  port: config.database.port,
  username: config.database.user,
  password: config.database.password,
  database: config.database.database,
  schema: config.database.schema,
  synchronize: false,
  logging: false,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts', 'src/seeds/*.ts'],
  subscribers: [],
};

export const AppDataSource = new DataSource(baseConfig);
