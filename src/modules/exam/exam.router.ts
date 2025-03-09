import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { examValidation } from './exam.validation';
import { examController } from './exam.controller';
import { USER_ROLES } from '../../utils/types';

const examRouter = Router();

examRouter.post(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(examValidation.addExam),
  examController.addExam,
);

export { examRouter };
