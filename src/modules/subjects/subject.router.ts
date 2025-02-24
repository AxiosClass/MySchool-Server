import { Router } from 'express';
import { subjectController } from './subject.controller';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { subjectValidation } from './subject.validation';
import { validationHandler } from '../../middlewares/validationHandler';

const subjectsRouter = Router();

subjectsRouter.put(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(subjectValidation.assignSubjectsSchema),
  subjectController.assignSubject,
);

subjectsRouter.get(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  subjectController.getSubjects,
);

export { subjectsRouter };
