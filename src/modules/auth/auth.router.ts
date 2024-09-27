import * as validation from './auth.validation';
import * as controller from './auth.controller';

import { Router } from 'express';
import { authGuard, validationHandler } from '../../middlewares';

export const authRouter = Router();

authRouter.post(
  '/login',
  validationHandler(validation.login),
  controller.login,
);

authRouter.post(
  '/change-password',
  authGuard(
    'ACCOUNTANT',
    'ADMIN',
    'MODERATOR',
    'STUDENT',
    'SUPER_ADMIN',
    'TEACHER',
  ),
  validationHandler(validation.changePassword),
  controller.changePassword,
);
