import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { termResultController } from './term-result.controller';

const termResultRouter = Router();

termResultRouter.get('/students', authGuard(USER_ROLES.TEACHER), termResultController.getStudentsWithTermResult);

export { termResultRouter };
