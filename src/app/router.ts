import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.router';
import { classroomRouter } from '../modules/classroom/classroom.router';
import { teacherRouter } from '../modules/teacher/teacher.router';
import { studentRouter } from '../modules/student/student.router';
import { classesRouter, classRouter } from '../modules/class/class.router';
import { paymentRouter } from '../modules/payment/payment.router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/teacher', teacherRouter);
appRouter.use('/class', classRouter);
appRouter.use('/classes', classesRouter);
appRouter.use('/classroom', classroomRouter);
appRouter.use('/student', studentRouter);
appRouter.use('/payment', paymentRouter);
