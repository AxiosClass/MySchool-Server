import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { attendanceService } from './attendance.service';

const addAttendance = catchAsync(async (req, res) => {
  const message = await attendanceService.addAttendance(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const getAttendancesForClassroom = catchAsync(async (req, res) => {
  const attendances = await attendanceService.getAttendancesForClassroom(req.params.classroomId);
  sendSuccessResponse(res, { message: 'Attendance fetched successfully', data: attendances });
});

export const attendanceController = { addAttendance, getAttendancesForClassroom };
