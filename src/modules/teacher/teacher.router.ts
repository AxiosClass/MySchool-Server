import { Router } from 'express';

import { USER_ROLES } from '../../utils/types';
import { validationHandler } from '../../middlewares/validationHandler';
import { teacherValidation } from './teacher.validation';
import { authGuard } from '../../middlewares/authGuard';
import { teacherController } from './teacher.controller';

export const teacherRouter = Router();

teacherRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(teacherValidation.addTeacherSchema),
  teacherController.addTeacher,
);

teacherRouter.get(
  '/:teacherId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  teacherController.getTeacherDetails,
);

export const teachersRouter = Router();

teachersRouter.get(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.ACCOUNTANT),
  teacherController.getTeachers,
);

teachersRouter.get('/list', authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), teacherController.getTeacherList);
