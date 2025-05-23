import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { classValidation } from './class.validation';
import { USER_ROLES } from '../../utils/types';
import { classController } from './class.controller';

const classRouter = Router();

classRouter.post(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(classValidation.addClassSchema),
  classController.addClass,
);

classRouter.get(
  '/:classId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classController.getClassDetails,
);

classRouter.patch(
  '/subjects',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  classController.updateAssignedSubjectList,
);

classRouter.get(
  '/:classId/subjects',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  classController.getAssignedClassSubject,
);

const classesRouter = Router();

// getting detailed class info
classesRouter.get(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classController.getClasses,
);

// getting short class info like name and id
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

export { classRouter, classesRouter };
