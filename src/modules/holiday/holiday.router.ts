import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { holidayValidation } from './holiday.validation';
import { holidayController } from './holiday.controller';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';

const holidayRouter = Router();

holidayRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(holidayValidation.addHolidaySchema),
  holidayController.addHoliday,
);

const holidaysRouter = Router();

holidaysRouter.get('/', authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), holidayController.getHolidays);

export { holidayRouter, holidaysRouter };
