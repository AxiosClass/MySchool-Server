import moment from 'moment';

import { prismaClient } from '../../app/prisma';
import { generateDateArray, generateHalfYearArray, generateHalfYearlyDateRange } from '../../helpers/common';

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

const getAttendanceTrends = async (range: number) => {
  const date = new Date();

  const start = moment(date)
    .subtract(range - 1, 'day')
    .startOf('day')
    .toDate();

  const end = moment(date).endOf('day').toDate();

  const attendances = await prismaClient.attendance.findMany({
    where: { date: { gte: start, lte: end } },
    select: { id: true, date: true },
  });

  const datesArray = generateDateArray({ start, end });

  const attendanceFormatted = datesArray.reduce((acc: { date: string; count: number }[], day) => {
    const dateFormat = moment(day).format('DD-MMM-YYYY');

    const matched = attendances.filter((attendance) => {
      const attendanceDateFormat = moment(attendance.date).format('DD-MMM-YYYY');
      return attendanceDateFormat === dateFormat;
    });

    acc.push({ date: dateFormat, count: matched.length });

    return acc;
  }, []);

  return attendanceFormatted;
};

const getPaymentTrends = async () => {
  const { start, end } = generateHalfYearlyDateRange();

  const payments = await prismaClient.payment.findMany({
    where: { createdAt: { gte: start, lte: end } },
    select: { amount: true, createdAt: true },
  });

  const datesArray = generateHalfYearArray();

  const paymentMap = datesArray.reduce((acc, date) => {
    return acc;
  }, []);
};

export const metaDataService = { getAttendanceSummary, getAttendanceTrends, getPaymentTrends };
