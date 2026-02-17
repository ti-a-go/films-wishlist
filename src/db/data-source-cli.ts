import { join } from 'path';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';

console.log('=================================');
console.log('NODE_ENV', process.env.NODE_ENV);
console.log('=================================');

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: String(process.env.DATABASE_PASSWORD),
  database: process.env.DATABASE_NAME,
  entities: [join(__dirname, '..', '**', '*.entity.{js,ts}')],
  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
