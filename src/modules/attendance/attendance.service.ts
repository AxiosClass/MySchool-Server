import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { attendanceHelper } from './attendance.helper';
import { TAddAttendancePayload } from './attendance.validation';

const addAttendance = async (payload: TAddAttendancePayload) => {
  const date = payload.date ? new Date(payload.date) : new Date();
  const dayRange = attendanceHelper.getDayRange(date);

  const isAttendanceExist = await prismaClient.attendance.findFirst({
    where: { studentId: payload.studentId, createdAt: { gte: dayRange.start, lte: dayRange.end } },
  });

  if (isAttendanceExist) throw new AppError('Attendance already added for this student', 400);

  const attendance = await prismaClient.attendance.create({ data: payload, select: { id: true } });
  if (!attendance.id) throw new AppError('Failed to add attendance', 400);

  return 'Attendance Added Successfully';
};

export const attendanceService = { addAttendance };
