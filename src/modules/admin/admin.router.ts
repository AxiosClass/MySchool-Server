import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { adminValidation } from './admin.validation';
import { USER_ROLES } from '../../utils/types';
import { adminController } from './admin.controller';

const adminRouter = Router();

adminRouter.post(
  '/',
  authGuard(USER_ROLES.SUPER_ADMIN),
  validationHandler(adminValidation.createAdminSchema),
  adminController.createAdmin,
);

adminRouter.delete('/:email', authGuard(USER_ROLES.SUPER_ADMIN), adminController.deleteAdmin);

const adminsRouter = Router();

adminsRouter.get('/', authGuard(USER_ROLES.SUPER_ADMIN), adminController.getAdmins);

export { adminRouter, adminsRouter };
