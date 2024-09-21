import * as validation from './validation';
import * as controller from './controller';

import { authGuard, validationHandler } from '../../middlewares';
import { Router } from 'express';

export const classRouter = Router();

classRouter.post(
  '/',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.addClass),
  controller.addClass,
);

classRouter.post(
  '/:classId/subjects',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.addOrRemoveSubjects),
  controller.addSubjects,
);

classRouter.delete(
  '/:classId/subjects',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.addOrRemoveSubjects),
  controller.removeSubjects,
);

classRouter.post(
  '/:classId/section',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.addSection),
  controller.addSection,
);

classRouter.post(
  '/:sectionId/assign-subject-teacher',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.assignSubjectTeacher),
  controller.assignSubjectTeacher,
);
