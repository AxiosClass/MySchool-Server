import { Router } from 'express';

import { USER_ROLES } from '../../utils/types';
import { authGuard } from '../../middlewares/authGuard';
import { classValidation } from './class.validation';
import { classController } from './class.controller';
import { validationHandler } from '../../middlewares/validationHandler';

export const classRouter = Router();

classRouter.post(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(classValidation.addClassSchema),
  classController.addClass,
);

// classRouter.post(
//   '/',
//   authGuard('ADMIN', 'SUPER_ADMIN'),
//   validationHandler(validation.addClass),
//   controller.addClass,
// );

// classRouter.post(
//   '/:classId/subjects',
//   authGuard('ADMIN', 'SUPER_ADMIN'),
//   validationHandler(validation.addOrRemoveSubjects),
//   controller.addSubjects,
// );

// classRouter.delete(
//   '/:classId/subjects',
//   authGuard('ADMIN', 'SUPER_ADMIN'),
//   validationHandler(validation.addOrRemoveSubjects),
//   controller.removeSubjects,
// );

// classRouter.post(
//   '/:classId/section',
//   authGuard('ADMIN', 'SUPER_ADMIN'),
//   validationHandler(validation.addSection),
//   controller.addSection,
// );

// classRouter.post(
//   '/:sectionId/assign-subject-teacher',
//   authGuard('ADMIN', 'SUPER_ADMIN'),
//   validationHandler(validation.assignSubjectTeacher),
//   controller.assignSubjectTeacher,
// );
