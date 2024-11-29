import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { paymentValidation } from './payment.validation';
import { paymentController } from './payment.controller';
import { USER_ROLES } from '../../utils/types';

export const paymentRouter = Router();

paymentRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(paymentValidation.takePaymentSchema),
  paymentController.takePayment,
);

paymentRouter.get(
  '/summary/:studentId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.ACCOUNTANT),
  paymentController.getPaymentSummary,
);
