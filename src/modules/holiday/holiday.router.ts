import { Router } from 'express';
import { validationHandler } from '../../middlewares/validationHandler';
import { holidayValidation } from './holiday.validation';
import { holidayController } from './holiday.controller';

const holidayRouter = Router();

holidayRouter.put(
  '/weekend',
  validationHandler(holidayValidation.addOrUpdateWeekendSchema),
  holidayController.addOrUpdateWeekend,
);

holidayRouter.get('/weekends', holidayController.getWeekends);

export { holidayRouter };
