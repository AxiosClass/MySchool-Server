import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { termResultController } from './term-result.controller';
import { validationHandler } from '../../middlewares/validationHandler';
import { termResultValidation } from './term-result.validation';

const termResultRouter = Router();

termResultRouter.post(
  '/',
  authGuard(USER_ROLES.TEACHER),
  validationHandler(termResultValidation.addTermResultSchema),
  termResultController.addTermResult,
);

termResultRouter.get('/students', authGuard(USER_ROLES.TEACHER), termResultController.getStudentsWithTermResult);

termResultRouter.get(
  '/summary/:studentId',
  authGuard(USER_ROLES.TEACHER, USER_ROLES.STUDENT, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  termResultController.getTermsResultSummary,
);

export { termResultRouter };
