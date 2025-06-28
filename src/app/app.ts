import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';

import { globalErrorHandler } from '../middlewares/globalErrorHandler';
import { appRouter } from './router';

export const app = express();

// parser
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 5 * 60 * 60 * 1000,
  max: 500,
  message: 'Too many request from this Ip, Please try again',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// apis
app.use('/api/v1', appRouter);

app.get('/', (_req, res) => {
  res.status(200).json({ ok: true, message: 'Welcome to MySchool server' });
});

app.all('*', (_req, res) => {
  res.status(404).json({ ok: false, message: 'Route not found' });
});

app.use(globalErrorHandler);
