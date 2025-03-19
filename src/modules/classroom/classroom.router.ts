import { Router } from 'express';

import { validationHandler } from '../../middlewares/validationHandler';
import { classroomValidation } from './classroom.validation';
import { classroomController } from './classroom.controller';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';

const classroomRouter = Router();

classroomRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(classroomValidation.createClassroom),
  classroomController.createClassroom,
);

classroomRouter.post(
  '/subject-teacher',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(classroomValidation.assignSubjectTeacher),
  classroomController.assignSubjectTeacher,
);

classroomRouter.delete(
  '/subject-teacher/:classroomSubjectTeacherId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  classroomController.removeSubjectTeacher,
);

classroomRouter.get(
  '/:classroomId/subjects',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  classroomController.getSubjectListWithTeacher,
);

classroomRouter.get(
  '/:classroomId/students',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER),
  classroomController.getStudentList,
);

const classroomsRouter = Router();

classroomsRouter.get(
  '/teacher/:teacherId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  classroomController.getClassroomListForTeacher,
);

export { classroomRouter, classroomsRouter };
