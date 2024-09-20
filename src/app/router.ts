import { staffRouter } from '../modules/staff/router';
import { classRouter } from '../modules/class/router';
import { authRouter } from '../modules/auth/router';
import { Router } from 'express';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/staff', staffRouter);
appRouter.use("/class", classRouter)