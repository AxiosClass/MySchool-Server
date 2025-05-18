import { Router } from 'express';
import { USER_ROLES } from '../../utils/types';
import { validationHandler } from '../../middlewares/validationHandler';
import { subjectController } from './subject.controller';
import { authGuard } from '../../middlewares/authGuard';
import { subjectValidation } from './subject.validation';

const subjectRouter = Router();

subjectRouter.post(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(subjectValidation.createSubjectSchema),
  subjectController.createSubject,
);

subjectRouter.delete(
  '/:subjectId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  subjectController.deleteSubject,
);

const subjectsRouter = Router();

subjectsRouter.get('/', authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN), subjectController.getSubjects);

subjectsRouter.patch(
  '/:classId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(subjectValidation.assignSubjectsSchema),
  subjectController.assignSubjects,
);

export { subjectRouter, subjectsRouter };
