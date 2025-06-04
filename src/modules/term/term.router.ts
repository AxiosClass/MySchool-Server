import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { validationHandler } from '../../middlewares/validationHandler';
import { termValidation } from './term.validation';
import { termController } from './term.controller';

const termRouter = Router();

termRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(termValidation.addOrUpdateTermSchema),
  termController.addTerms,
);

termRouter.patch(
  '/:termId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(termValidation.addOrUpdateTermSchema),
  termController.updateTerm,
);

termRouter.patch(
  '/:termId/status',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(termValidation.updateStatusSchema),
  termController.updateStatus,
);

termRouter.delete('/:termId', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), termController.deleteTerm);

const termsRouter = Router();

termsRouter.get('/', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), termController.getTerms);

export { termRouter, termsRouter };
