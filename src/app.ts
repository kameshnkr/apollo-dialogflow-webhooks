import express, { Application } from 'express';
import cors from 'cors';

import webHookRouter from './routes/webhook.routes';
import genericRouter from './routes';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/webhook', webHookRouter);
app.use('/', genericRouter);

module.exports = app;