<<<<<<< HEAD
import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';
=======
import { DataSource } from "typeorm";
import { Usuario } from "../entities/Usuario.js";
import { NaoConformidade } from "../entities/NaoConformidade.js";
import { AcaoCorretiva } from "../entities/AcaoCorretiva.js";
>>>>>>> 9782cdc (feat: front e back)

export const appDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST as string,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER as string,
    password: process.env.DB_PASS as string,
    database: process.env.DB_NAME as string,
    synchronize: true,
    logging: false,
<<<<<<< HEAD
    entities: [User]
})
=======
    entities: [Usuario, NaoConformidade, AcaoCorretiva],
});
>>>>>>> 9782cdc (feat: front e back)
