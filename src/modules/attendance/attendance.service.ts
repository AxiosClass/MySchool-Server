import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TAddAttendancePayload } from './attendance.validation';

const addAttendance = async (payload: TAddAttendancePayload) => {
  const attendance = await prismaClient.attendance.create({ data: payload });
  if (!attendance.id) throw new AppError('Failed to add attendance', 400);
  return 'Attendance added successfully';
};

export const attendanceService = { addAttendance };
