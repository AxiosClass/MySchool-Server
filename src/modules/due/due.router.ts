import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { dueController } from './due.controller';

const duesRouter = Router();

duesRouter.get('/class', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), dueController.getDueByClass);
duesRouter.get('/classroom', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), dueController.getDueByClassroom);
duesRouter.get('/student', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), dueController.getDuesByStudent);

export { duesRouter };
