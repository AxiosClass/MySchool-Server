import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { attendanceService } from './attendance.service';

const addAttendance = catchAsync(async (req, res) => {
  const message = await attendanceService.addAttendance(req.body);
  sendSuccessResponse(res, { message, data: null });
});

export const attendanceController = { addAttendance };
