import { Router } from 'express';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import { validationHandler } from '../../middlewares/validationHandler';
import { attendanceValidation } from './attendance.validation';
import { attendanceController } from './attendance.controller';

const attendanceRouter = Router();

attendanceRouter.post(
  '/',
  // authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(attendanceValidation.addAttendanceSchema),
  attendanceController.addAttendance,
);

export { attendanceRouter };
