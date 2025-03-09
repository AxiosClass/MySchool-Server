import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { holidayValidation } from './holiday.validation';
import { holidayController } from './holiday.controller';

const holidayRouter = Router();

holidayRouter.post('/', validationHandler(holidayValidation.addHolidaySchema), holidayController.addHoliday);
holidayRouter.get('/', holidayController.getHolidays);

export { holidayRouter };
