import { Router } from 'express';
import { USER_ROLES } from '../../utils/types';
import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { noticeValidation } from './notice.validation';
import { noticeController } from './notice.controller';

export const noticeRouter = Router();

noticeRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(noticeValidation.createNotice),
  noticeController.createNotice,
);

export const noticesRouter = Router();

noticesRouter.get('/', noticeController.getNotices);
