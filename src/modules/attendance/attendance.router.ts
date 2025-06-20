import { Router } from 'express';

import { USER_ROLES } from '../../utils/types';
import { authGuard } from '../../middlewares/authGuard';
import { validationHandler } from '../../middlewares/validationHandler';
import { attendanceValidation } from './attendance.validation';
import { attendanceController } from './attendance.controller';

const attendanceRouter = Router();

attendanceRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER),
  validationHandler(attendanceValidation.addAttendanceSchema),
  attendanceController.addAttendance,
);

attendanceRouter.post(
  '/nfc',
  validationHandler(attendanceValidation.addAttendanceFormNfcSchema),
  attendanceController.addAttendanceFormNfc,
);

attendanceRouter.get(
  '/summary/:studentId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.SUPER_ADMIN, USER_ROLES.STUDENT),
  attendanceController.getAttendanceSummaryForStudent,
);

attendanceRouter.delete(
  '/:attendanceId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER),
  attendanceController.removeAttendance,
);

const attendancesRouter = Router();

attendancesRouter.get(
  '/classroom/:classroomId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER),
  attendanceController.getAttendancesForClassroom,
);

attendancesRouter.get(
  '/student/:studentId',
  authGuard(USER_ROLES.STUDENT, USER_ROLES.TEACHER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  attendanceController.getAttendancesForStudent,
);

export { attendanceRouter, attendancesRouter };
