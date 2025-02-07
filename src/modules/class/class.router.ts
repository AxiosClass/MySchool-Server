import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';

import { authGuard } from '../../middlewares/authGuard';
import { classValidation } from './class.validation';
import { USER_ROLES } from '../../utils/types';
import { classController } from './class.controller';

export const classRouter = Router();

classRouter.post(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(classValidation.addClassSchema),
  classController.addClass,
);

classRouter.post(
  '/:classId/subjects',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(classValidation.addOrRemoveSubjects),
  classController.addSubjects,
);

classRouter.get(
  '/:classId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classController.getClassDetails,
);

export const classesRouter = Router();

classesRouter.get(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classController.getClasses,
);

classesRouter.get(
  '/list',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classController.getClassList,
);

classesRouter.get(
  '/list/classroom/:level',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classController.getClassroomList,
);
