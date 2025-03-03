import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { holidayService } from './holiday.service';

const addOrUpdateWeekend = catchAsync(async (req, res) => {
  const message = await holidayService.addOrUpdateWeekends(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const getWeekends = catchAsync(async (req, res) => {
  const weekends = await holidayService.getWeekends();
  sendSuccessResponse(res, { message: 'Weekend fetched successfully', data: weekends });
});

export const holidayController = { addOrUpdateWeekend, getWeekends };
