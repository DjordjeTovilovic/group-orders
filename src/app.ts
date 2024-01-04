import express, { Application } from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import { errorMiddleware } from './middlewares';
import routes from './api/routes';

dotenv.config();
const app: Application = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errorMiddleware);

export default app;
