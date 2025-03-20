import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();
export const appDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: process.env.DB_PORT ? +process.env.DB_PORT : 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'nestdb',
  synchronize: false,
  logging: true,
  migrationsTableName: 'migrations',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migration/**/*{.ts,.js}'],
  migrationsRun: true,
  subscribers: [],
  name: 'default',
});
