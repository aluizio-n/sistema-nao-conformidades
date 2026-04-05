import 'reflect-metadata';
import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import { appDataSource } from './database/appDataSource.js';
import routes from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(helmet());
app.use(compression());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 }));
app.use(express.json());
app.use(routes);
app.use(errorHandler);

appDataSource.initialize()
        .then(() => {
            console.log('banco conectado')
            app.listen(PORT, () => {
            console.log(`Server is running in PORT: ${PORT}`)
        })
        })
        .catch((error) => {
            console.log(error)
        })