import { sendSuccessResponse } from '../../helpers/responseHelper';
import { attendanceService } from './attendance.service';
import { catchAsync } from '../../middlewares/catchAsync';

const addAttendance = catchAsync(async (req, res) => {
  const message = await attendanceService.addAttendance(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const getAttendancesForClassroom = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendancesForClassroom(req.params.classroomId);
  sendSuccessResponse(res, { message: 'Attendance fetched successfully', data: result });
});

export const attendanceController = { addAttendance, getAttendancesForClassroom };
