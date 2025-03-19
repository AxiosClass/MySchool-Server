import moment from 'moment';

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

const getAttendancesForClassroom = async (classroomId: string) => {
  const now = new Date();
  const isWeekend = weekendDays.includes(now.getDay());

  // check if it is weekend
  if (isWeekend) return { isWeekend: true };

  const start = moment(now).startOf('day').toDate();
  const end = moment(now).endOf('day').toDate();
  // check if it is holiday
  const holiday = await prismaClient.holiDay.findFirst({
    where: { startDate: { gte: start }, endDate: { gte: end } },
    select: { id: true },
  });

  if (holiday?.id) return { isHoliday: true };

  const attendances = await prismaClient.attendance.findMany({
    where: { student: { classroomId }, date: { gte: start, lte: end } },
    select: { id: true, date: true, studentId: true, createdAt: true },
  });

  const students = await prismaClient.student.findMany({ where: { classroomId } });

  const attendaceList = students.map((student) => {
    const attendance = attendances.find((attendance) => attendance.studentId === student.id);

    return {
      attendanceId: attendance?.id ?? null,
      studentId: student.id,
      name: student.name,
      forDate: attendance?.date ?? null,
      attendanceCreatedAt: attendance?.createdAt ?? null,
    };
  });

  return { attendaceList };
};

const removeAttendance = async (attendanceId: string) => {
  await prismaClient.attendance.delete({ where: { id: attendanceId } });
  return 'Attendance Removed Successfully';
};

export const attendanceService = { addAttendance, getAttendancesForClassroom, removeAttendance };
