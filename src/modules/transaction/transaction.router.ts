import * as validation from './transaction.validation';
import * as controller from './transaction.controller';

import { authGuard, validationHandler } from '../../middlewares';
import { Router } from 'express';

export const transactionRouter = Router();

transactionRouter.post(
  '/payment',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.addPaymentSchema),
  controller.addPayment,
);

transactionRouter.post(
  '/salary',
  authGuard('ADMIN', 'SUPER_ADMIN'),
  validationHandler(validation.giveSalarySchema),
  controller.giveSalary,
);
