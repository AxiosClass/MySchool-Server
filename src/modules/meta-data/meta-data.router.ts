import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { metaDataController } from './meta-data.controller';

const metaDataRouter = Router();

metaDataRouter.get(
  '/attendance/summary',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  metaDataController.getAttendanceSummary,
);

export { metaDataRouter };
