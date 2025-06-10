import moment from 'moment';

import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { attendanceHelper, weekendDays } from './attendance.helper';
import { TAddAttendanceFromNfcPayload, TAddAttendancePayload } from './attendance.validation';
import { TObject } from '../../utils/types';
import { generateDateArray, parseDate } from '../../helpers/common';

const addAttendance = async (payload: TAddAttendancePayload) => {
  const date = payload.date ? new Date(payload.date) : new Date();
  const dayRange = attendanceHelper.getDayRange(date);

  const isAttendanceExist = await prismaClient.attendance.findFirst({
    where: { studentId: payload.studentId, date: { gte: dayRange.start, lte: dayRange.end } },
    select: { id: true },
  });

  if (isAttendanceExist?.id) throw new AppError('Attendance already added for this student', 400);
  const attendance = await prismaClient.attendance.create({ data: payload, select: { id: true } });
  if (!attendance.id) throw new AppError('Failed to add attendance', 400);

  return 'Attendance Added Successfully';
};

const addAttendanceFormNfc = async (payload: TAddAttendanceFromNfcPayload) => {
  const date = new Date();
  const { start, end } = attendanceHelper.getDayRange(date);

  const studentInfo = await prismaClient.student.findFirst({ where: { cardId: payload.cardId }, select: { id: true } });
  if (!studentInfo) throw new AppError('Invalid CardId', 400);

  const isAttendanceExist = await prismaClient.attendance.findFirst({
    where: { studentId: studentInfo.id, date: { gte: start, lte: end } },
    select: { id: true },
  });

  if (isAttendanceExist?.id) throw new AppError('Attendance already added for this student', 400);

  const attendance = await prismaClient.attendance.create({
    data: { studentId: studentInfo.id },
    select: { id: true },
  });

  if (!attendance.id) throw new AppError('Failed to add attendance', 400);

  return 'Attendance Added Successfully';
};

const getAttendancesForClassroom = async (classroomId: string, query: TObject) => {
  const date = parseDate(query.date);

  const start = moment(date).startOf('day').toDate();
  const end = moment(date).endOf('day').toDate();
  const day = date.getDay();

  const classroomInfo = await prismaClient.classroom.findUnique({
    where: { id: classroomId },
    select: { id: true, classTeacherId: true },
  });

  const attendances = await prismaClient.attendance.findMany({
    where: { student: { classroomId: classroomId }, date: { gte: start, lte: end } },
    select: { id: true, date: true, studentId: true },
  });

  const holiday = await prismaClient.holiDay.findFirst({ where: { startDate: { lte: start }, endDate: { gte: end } } });
  const students = await prismaClient.student.findMany({ where: { classroomId }, select: { id: true, name: true } });

  const attendanceMap = new Map(attendances.map((attendance) => [attendance.studentId, attendance]));

  const isHoliday = !!holiday || weekendDays.includes(day);

  const studentAttendanceList = students.map((student) => {
    const isPresent = attendanceMap.has(student.id);

    return {
      date,
      studentId: student.id,
      name: student.name,
      attendanceId: attendanceMap.get(student.id)?.id || '',
      status: isPresent ? 'PRESENT' : isHoliday ? 'HOLIDAY' : 'ABSENT',
    };
  });

  return {
    attendanceList: studentAttendanceList,
    totalStudents: students.length,
    totalPresent: attendanceMap.size,
    classTeacherId: classroomInfo?.classTeacherId || '',
  };
};

const getAttendancesForStudent = async (studentId: string, query: TObject) => {
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: { id: true, name: true },
  });

  if (!student) throw new AppError('Student not found', 404);

  const start = query.start
    ? moment(query.start).startOf('day').toDate()
    : moment(new Date()).subtract(30, 'day').endOf('day').toDate();

  const end = query.end ? moment(query.end).endOf('day').toDate() : moment(new Date()).endOf('day').toDate();

  const attendances = await prismaClient.attendance.findMany({
    where: { student: { id: studentId }, date: { gte: start, lte: end } },
    select: { id: true, date: true, studentId: true },
  });

  const holidays = await prismaClient.holiDay.findMany({
    where: { startDate: { gte: start }, endDate: { lte: end } },
    select: { id: true, startDate: true, endDate: true },
  });

  const dates = generateDateArray({ start, end });
  const attendanceMap = attendanceHelper.generateAttendanceMap(attendances);
  const holidayMap = attendanceHelper.generateHolidayMap(holidays);

  const attendanceList = attendanceHelper.generateAttendance({ dates, attendanceMap, holidayMap, student });

  return { ...attendanceList, attendances: attendanceList.attendances.reverse() };
};

const removeAttendance = async (attendanceId: string) => {
  await prismaClient.attendance.delete({ where: { id: attendanceId } });
  return 'Attendance Removed Successfully';
};

export const attendanceService = {
  addAttendance,
  addAttendanceFormNfc,
  getAttendancesForClassroom,
  getAttendancesForStudent,
  removeAttendance,
};
