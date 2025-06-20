import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { paymentValidation } from './payment.validation';
import { paymentController } from './payment.controller';
import { USER_ROLES } from '../../utils/types';

const paymentRouter = Router();

paymentRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(paymentValidation.takePaymentSchema),
  paymentController.takePayment,
);

const paymentsRouter = Router();

paymentsRouter.get(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.ACCOUNTANT, USER_ROLES.STUDENT),
  paymentController.getPayments,
);

export { paymentRouter, paymentsRouter };
