import moment from 'moment';

import { prismaClient } from '../../app/prisma';

const getAttendanceSummary = async () => {
  const studentsCount = await prismaClient.student.count({ where: { status: 'ACTIVE' } });

  const date = new Date();
  const start = moment(date).startOf('day').toDate();
  const end = moment(date).endOf('day').toDate();

  const attendanceCount = await prismaClient.attendance.count({ where: { date: { gte: start, lte: end } } });

  return {
    totalStudents: studentsCount,
    present: attendanceCount,
    absent: studentsCount - attendanceCount,
  };
};

export const metaDataService = { getAttendanceSummary };
