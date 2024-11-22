import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.router';
import { teacherRouter } from '../modules/teacher/teacher.router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/teacher', teacherRouter);
