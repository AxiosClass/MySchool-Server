import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.router';
import { classroomRouter } from '../modules/classroom/classroom.router';
import { teacherRouter } from '../modules/teacher/teacher.router';
import { classRouter } from '../modules/class/class.router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/teacher', teacherRouter);
appRouter.use('/class', classRouter);
appRouter.use('/classroom', classroomRouter);
