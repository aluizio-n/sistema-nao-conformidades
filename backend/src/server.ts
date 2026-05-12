import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import compression from 'compression';
import { appDataSource } from './database/appDataSource.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(compression());
app.use(express.json());

app.use((_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (_req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});

app.use("/api", routes);
app.use(errorHandler);

appDataSource
    .initialize()
    .then(() => {
        console.log("Banco de dados conectado");
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Erro ao conectar ao banco:", error);
    });
