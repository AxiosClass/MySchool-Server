import { Router } from 'express';

import { USER_ROLES } from '../../utils/types';
import { authGuard } from '../../middlewares/authGuard';
import { studentValidation } from './student.validation';
import { studentController } from './student.controller';
import { validationHandler } from '../../middlewares/validationHandler';

const studentRouter = Router();

studentRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(studentValidation.addStudentSchema),
  studentController.addStudent,
);

studentRouter.post(
  '/issue-nfc',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(studentValidation.issueNfcCardSchema),
  studentController.issueNfcCard,
);

studentRouter.get(
  '/:studentId',
  authGuard(USER_ROLES.STUDENT, USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER),
  studentController.getStudentInfo,
);

const studentsRouter = Router();

studentsRouter.get(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.ACCOUNTANT),
  studentController.getStudents,
);

studentsRouter.get(
  '/list',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  studentController.getStudentListForPayment,
);

export { studentRouter, studentsRouter };
