import { sendSuccessResponse } from '../../helpers/responseHelper';
import { attendanceService } from './attendance.service';
import { catchAsync } from '../../middlewares/catchAsync';

const addAttendance = catchAsync(async (req, res) => {
  const message = await attendanceService.addAttendance(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const addAttendanceFormNfc = catchAsync(async (req, res) => {
  const message = await attendanceService.addAttendanceFormNfc(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const getAttendancesForClassroom = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendancesForClassroom(req.params.classroomId, Number(req.query.range));
  sendSuccessResponse(res, { message: 'Attendance fetched successfully', data: result });
});

const removeAttendance = catchAsync(async (req, res) => {
  const message = await attendanceService.removeAttendance(req.params.attendanceId);
  sendSuccessResponse(res, { message, data: null });
});

export const attendanceController = {
  addAttendance,
  addAttendanceFormNfc,
  getAttendancesForClassroom,
  removeAttendance,
};
