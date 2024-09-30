import * as validation from './class.validation';
import * as controller from './class.controller';

import { authGuard, validationHandler } from '../../middlewares';
import { Router } from 'express';

export const staffRouter = Router();

staffRouter.post(
  '/teacher',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.addTeacher),
  controller.addTeacher,
);
