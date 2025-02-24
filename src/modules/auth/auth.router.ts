import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { authController } from './auth.controller';
import { authValidation } from './auth.validation';

const authRouter = Router();
authRouter.post('/login', validationHandler(authValidation.loginSchema), authController.login);

export { authRouter };
