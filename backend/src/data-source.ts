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
  entities: ['./src/**/*.entity.ts'],
  migrations: ['./src/migrations/*.ts'],
  subscribers: [],
  logging: true,
  migrationsRun: true,
};

export const dataSource = new DataSource(baseConfig);
