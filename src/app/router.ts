import { transactionRouter } from '../modules/transaction/transaction.router';
import { staffRouter } from '../modules/staff/class.router';
import { classRouter } from '../modules/class/class.router';
import { studentRouter } from '../modules/student/router';
import { authRouter } from '../modules/auth/auth.router';
import { Router } from 'express';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/staff', staffRouter);
appRouter.use('/class', classRouter);
appRouter.use('/student', studentRouter);
appRouter.use('/transaction', transactionRouter);
