import { Router } from 'express';

import { authRouter } from '../modules/auth/auth.router';
import { classroomRouter } from '../modules/classroom/classroom.router';
import { classesRouter, classRouter } from '../modules/class/class.router';
import { teacherRouter, teachersRouter } from '../modules/teacher/teacher.router';
import { paymentRouter, paymentsRouter } from '../modules/payment/payment.router';
import { studentRouter, studentsRouter } from '../modules/student/student.router';
import { noticeRouter, noticesRouter } from '../modules/notice/notice.router';

export const appRouter = Router();

const routes: { path: string; router: Router }[] = [
  { path: '/auth', router: authRouter },
  { path: '/teacher', router: teacherRouter },
  { path: '/teachers', router: teachersRouter },
  { path: '/class', router: classRouter },
  { path: '/classes', router: classesRouter },
  { path: '/classroom', router: classroomRouter },
  { path: '/student', router: studentRouter },
  { path: '/students', router: studentsRouter },
  { path: '/payment', router: paymentRouter },
  { path: '/payments', router: paymentsRouter },
  { path: '/notice', router: noticeRouter },
  { path: '/notices', router: noticesRouter },
];

routes.forEach(({ path, router }) => appRouter.use(path, router));
