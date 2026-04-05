import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';

export const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
    synchronize: true,
    logging: false,
    entities: [User]
})