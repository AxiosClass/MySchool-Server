import * as validation from './student.validation';
import * as controller from './student.controller';

import { authGuard, validationHandler } from '../../middlewares';
import { Router } from 'express';

export const studentRouter = Router();

studentRouter.post(
  '/',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.addStudentSchema),
  controller.addStudent,
);
