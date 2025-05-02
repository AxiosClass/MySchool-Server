import moment from 'moment';

import { Attendance, HoliDay, Student } from '@prisma/client';

// const
const weekendDays = [5, 6];
const dateFormatString = 'YYYY-MM-DD';

// helper functions
const getDayRange = (date: Date) => {
  const start = moment(date).startOf('day').toDate();
  const end = moment(date).endOf('day').toDate();

  return { start, end };
};

const generateDateArray = ({ start, end }: TGenerateDateArrayArgs) => {
  const dateArray = [];
  let currentDate = moment(start).clone();

  while (currentDate.isSameOrBefore(end, 'day')) {
    dateArray.push(currentDate.toDate());
    currentDate.add(1, 'day');
  }

  return dateArray;
};

const generateAttendanceMap = (attendances: TAttendance[]) => {
  //  attendanceMap = { date: { studentId: true } };
  const attendanceMap: TAttendanceMap = {};

  attendances.forEach((attendance) => {
    const { date, studentId, id } = attendance;
    const formattedDate = moment(date).format(dateFormatString);
    if (!attendanceMap[formattedDate]) attendanceMap[formattedDate] = {};
    attendanceMap[formattedDate][studentId] = id;
  });

  return attendanceMap;
};

const generateHolidayMap = (holidays: Pick<HoliDay, 'id' | 'startDate' | 'endDate'>[]) => {
  const holidayMap: THolidayMap = {};

  holidays.forEach((holiday) => {
    const { startDate, endDate } = holiday;
    const dates = generateDateArray({ start: startDate, end: endDate });

    dates.forEach((date) => {
      const formattedDate = moment(date).format(dateFormatString);
      if (!holidayMap[formattedDate]) holidayMap[formattedDate] = true;
    });
  });

  return holidayMap;
};

const generateAttendance = ({ dates, student, holidayMap, attendanceMap }: TGenerateAttendanceArgs) => {
  return {
    id: student.id,
    name: student.name,
    attendances: dates.map((date) => {
      let status: TAttendanceStatus = 'ABSENT';
      let attendanceId = '';
      const formattedDate = moment(date).format(dateFormatString);

      if (holidayMap[formattedDate]) status = 'HOLIDAY';
      else if (attendanceMap[formattedDate]?.[student.id]) {
        status = 'PRESENT';
        attendanceId = attendanceMap[formattedDate][student.id];
      }

      return { date: formattedDate, status, attendanceId };
    }),
  };
};

// types
type TGenerateDateArrayArgs = { start: Date; end: Date };

type TGenerateAttendanceArgs = {
  dates: Date[];
  student: Pick<Student, 'id' | 'name'>;
  holidayMap: THolidayMap;
  attendanceMap: TAttendanceMap;
};

type TAttendanceStatus = 'PRESENT' | 'ABSENT' | 'HOLIDAY';
type TAttendance = Pick<Attendance, 'id' | 'date' | 'studentId'>;
type TAttendanceMap = Record<string, Record<string, string>>;
type THolidayMap = Record<string, boolean>;

export const attendanceHelper = {
  getDayRange,
  generateDateArray,
  generateAttendanceMap,
  generateHolidayMap,
  generateAttendance,
};
