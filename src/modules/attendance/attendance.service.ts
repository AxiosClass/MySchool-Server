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

const getAttendancesForClassroom = async (classroomId: string, range: number = 7) => {
  const now = new Date();

  const start = moment(now)
    .subtract(range - 1, 'day')
    .startOf('day')
    .toDate();

  const end = moment(now).endOf('day').toDate();

  // fetching student's attendance data
  const attendances = await prismaClient.attendance.findMany({
    where: { student: { classroomId }, date: { gte: start, lte: end } },
    select: { id: true, date: true, studentId: true },
  });

  // getting holiday list
  const holidays = await prismaClient.holiDay.findMany({
    where: { OR: [{ startDate: { gte: start } }, { endDate: { lte: end } }] },
    select: { id: true, startDate: true, endDate: true },
  });

  // fetching all student list
  const students = await prismaClient.student.findMany({ where: { classroomId }, select: { id: true, name: true } });
  const dates = attendanceHelper.generateDateArray({ start, end });
  const attendanceMap = attendanceHelper.generateAttendanceMap(attendances);
  const holidayMap = attendanceHelper.generateHolidayMap(holidays);

  const attendanceList = students.map((student) =>
    attendanceHelper.generateAttendance({ attendanceMap, dates, holidayMap, student }),
  );

  return attendanceList;
};

const removeAttendance = async (attendanceId: string) => {
  await prismaClient.attendance.delete({ where: { id: attendanceId } });
  return 'Attendance Removed Successfully';
};

export const attendanceService = { addAttendance, getAttendancesForClassroom, removeAttendance };
