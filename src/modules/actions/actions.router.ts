import { Router } from 'express';
import { actionsController } from './actions.control';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { validationHandler } from '../../middlewares/validationHandler';
import { actionValidation } from './action.validation';

const actionsRouter = Router();

actionsRouter.get('/monthly-dues', actionsController.addMonthlyDues);

actionsRouter.post(
  '/discount',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(actionValidation.addDiscountSchema),
  actionsController.addDiscount,
);

actionsRouter.patch(
  '/promote',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(actionValidation.promoteStudentSchema),
  actionsController.promoteStudent,
);

export { actionsRouter };
