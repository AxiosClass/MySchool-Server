import { staffRouter } from '../modules/staff/router';
import { classRouter } from '../modules/class/router';
import { authRouter } from '../modules/auth/router';
import { Router } from 'express';
import { studentRouter } from '../modules/student/router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/staff', staffRouter);
appRouter.use('/class', classRouter);
appRouter.use('/student', studentRouter);
