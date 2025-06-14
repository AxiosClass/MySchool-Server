import { Router } from 'express';
import { authController } from '../auth/auth.controller';
import { actionsController } from './actions.control';

const actionsRouter = Router();

actionsRouter.get('/monthly-dues', actionsController.addMonthlyDues);

export { actionsRouter };
