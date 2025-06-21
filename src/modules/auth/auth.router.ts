import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';

const authRouter = Router();

authRouter.post('/login', validationHandler(authValidation.loginSchema), authController.login);

authRouter.patch(
  '/change-password',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  validationHandler(authValidation.changePasswordSchema),
  authController.changePassword,
);

export { authRouter };
