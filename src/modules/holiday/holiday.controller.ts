import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { holidayService } from './holiday.service';
import { TObject } from '../../utils/types';

const addHoliday = catchAsync(async (req, res) => {
  const message = await holidayService.addHoliday(req.body);
  sendSuccessResponse(res, { message });
});

const getHolidays = catchAsync(async (req, res) => {
  const { holidays, meta } = await holidayService.getHolidays(req.query as TObject);
  sendSuccessResponse(res, { message: 'Holidays fetched successfully', meta, data: holidays });
});

export const holidayController = { addHoliday, getHolidays };
