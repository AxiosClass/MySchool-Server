import { sendSuccessResponse } from '../../helpers/responseHelper';
import { attendanceService } from './attendance.service';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';

const addAttendance = catchAsync(async (req, res) => {
  const message = await attendanceService.addAttendance(req.body);
  sendSuccessResponse(res, { message });
});

const addAttendanceFormNfc = catchAsync(async (req, res) => {
  const message = await attendanceService.addAttendanceFormNfc(req.body);
  sendSuccessResponse(res, { message });
});

const getAttendancesForClassroom = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendancesForClassroom(req.params.classroomId, req.query as TObject);
  sendSuccessResponse(res, { message: 'Attendance fetched successfully', data: result });
});

const getAttendancesForStudent = catchAsync(async (req, res) => {
  const result = await attendanceService.getAttendancesForStudent(req.params.studentId, req.query as TObject);
  sendSuccessResponse(res, { message: 'Attendance fetched successfully', data: result });
});

const removeAttendance = catchAsync(async (req, res) => {
  const message = await attendanceService.removeAttendance(req.params.attendanceId);
  sendSuccessResponse(res, { message });
});

export const attendanceController = {
  addAttendance,
  addAttendanceFormNfc,
  getAttendancesForClassroom,
  getAttendancesForStudent,
  removeAttendance,
};
