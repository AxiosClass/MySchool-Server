import { Router } from 'express';

import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { studentValidation } from './student.validation';
import { studentController } from './student.controller';
import { USER_ROLES } from '../../utils/types';

export const studentRouter = Router();

studentRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(studentValidation.addStudentSchema),
  studentController.addStudent,
);
