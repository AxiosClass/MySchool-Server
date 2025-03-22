import { Router } from 'express';

import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { gradeController } from './grade.controller';
import { gradeValidation } from './grade.validation';
import { validationHandler } from '../../middlewares/validationHandler';

const gradeRouter = Router();

gradeRouter.post(
  '/',
  authGuard(USER_ROLES.TEACHER),
  validationHandler(gradeValidation.addOrUpdateGradeSchema),
  gradeController.addOrUpdateGrade,
);

export { gradeRouter };
