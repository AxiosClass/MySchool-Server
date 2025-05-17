import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { subjectController } from './subject.controller';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { subjectValidation } from './subject.validation';

const subjectRouter = Router();

subjectRouter.post(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(subjectValidation.createSubjectSchema),
  subjectController.createSubject,
);

subjectRouter.patch(
  '/:subjectId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(subjectValidation.updateSubjectSchema),
  subjectController.updateSubject,
);

subjectRouter.delete(
  '/:subjectId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  subjectController.deleteSubject,
);

const subjectsRouter = Router();

subjectsRouter.get('/', authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), subjectController.getSubjects);

export { subjectRouter, subjectsRouter };
