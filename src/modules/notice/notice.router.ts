import { validationHandler } from '../../middlewares/validationHandler';
import { authGuard } from '../../middlewares/authGuard';
import { noticeValidation } from './notice.validation';
import { noticeController } from './notice.controller';
import { USER_ROLES } from '../../utils/types';
import { Router } from 'express';

const noticeRouter = Router();

noticeRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(noticeValidation.createNotice),
  noticeController.createNotice,
);

noticeRouter.patch(
  '/:noticeId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(noticeValidation.updateNotice),
  noticeController.updateNotice,
);

noticeRouter.delete('/:noticeId', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), noticeController.deleteNotice);

const noticesRouter = Router();

noticesRouter.get('/', noticeController.getNotices);

export { noticeRouter, noticesRouter };
