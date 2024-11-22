import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';

export const authRoutes = Router();

authRoutes.post(
  '/login',
  validationHandler(authValidation.loginSchema),
  authController.login,
);
