import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.router';
import { classroomRouter } from '../modules/classroom/classroom.router';
import { classesRouter, classRouter } from '../modules/class/class.router';
import { teacherRouter, teachersRouter } from '../modules/teacher/teacher.router';
import { paymentRouter, paymentsRouter } from '../modules/payment/payment.router';
import { studentRouter, studentsRouter } from '../modules/student/student.router';
import { noticeRouter, noticesRouter } from '../modules/notice/notice.router';

export const appRouter = Router();

appRouter.use('/auth', authRouter);
appRouter.use('/teacher', teacherRouter);
appRouter.use('/teachers', teachersRouter);
appRouter.use('/class', classRouter);
appRouter.use('/classes', classesRouter);
appRouter.use('/classroom', classroomRouter);
appRouter.use('/student', studentRouter);
appRouter.use('/students', studentsRouter);
appRouter.use('/payment', paymentRouter);
appRouter.use('/payments', paymentsRouter);
appRouter.use('/notice', noticeRouter);
appRouter.use('/notices', noticesRouter);
