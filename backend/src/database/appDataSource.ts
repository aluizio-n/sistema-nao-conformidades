import { DataSource } from 'typeorm';
import { Usuario } from '../entities/Usuario.js';
import { NaoConformidade } from '../entities/NaoConformidade.js';
import { AcaoCorretiva } from '../entities/AcaoCorretiva.js';

export const appDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
    synchronize: true,
    logging: false,
    entities: [Usuario, NaoConformidade, AcaoCorretiva],
});
