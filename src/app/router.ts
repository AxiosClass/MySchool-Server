import { transactionRouter } from '../modules/transaction/transaction.router';
import { studentRouter } from '../modules/student/router';
import { staffRouter } from '../modules/staff/router';
import { classRouter } from '../modules/class/router';
import { authRouter } from '../modules/auth/router';
import { Router } from 'express';

export const appRouter = Router();

appRouter.use('/transaction', transactionRouter);
appRouter.use('/student', studentRouter);
appRouter.use('/staff', staffRouter);
appRouter.use('/class', classRouter);
appRouter.use('/auth', authRouter);
