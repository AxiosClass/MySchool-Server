import { Router } from 'express';
import { subjectController } from './subject.controller';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { subjectValidation } from './subject.validation';
import { validationHandler } from '../../middlewares/validationHandler';

const subjectRouter = Router();

subjectRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(subjectValidation.createSubjectSchema),
  subjectController.createSubject,
);

export { subjectRouter };
