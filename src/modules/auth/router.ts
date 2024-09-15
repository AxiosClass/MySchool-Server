import * as validation from './validation';
import * as controller from './controller';

import { Router } from 'express';
import { authGuard, validationHandler } from '../../middlewares';

export const authRouter = Router();

authRouter.post(
  '/login',
  validationHandler(validation.loginValidationSchema),
  controller.login,
);

authRouter.post(
  '/change-password',
  authGuard('SUPER_ADMIN', 'ADMIN', 'ACCOUNTANT', 'TEACHER', 'STUDENT'),
  validationHandler(validation.changePasswordValidationSchema),
  controller.changePassword,
);
