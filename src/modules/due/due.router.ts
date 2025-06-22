import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { dueController } from './due.controller';

const duesRouter = Router();

duesRouter.get('/classroom', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), dueController.getDueByClassroom);

export { duesRouter };
