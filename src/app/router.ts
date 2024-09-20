import { staffRouter } from '../modules/staff/router';
import { authRouter } from '../modules/auth/router';
import { Router } from 'express';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/staff', staffRouter);
