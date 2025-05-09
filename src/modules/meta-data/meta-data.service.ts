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
  const dateFormatStr = 'DD-MMM-YYYY';

  const attendances = await prismaClient.attendance.findMany({
    where: { date: { gte: start, lte: end } },
    select: { id: true, date: true },
  });

  const attendanceMap = attendances.reduce((acc: Record<string, number>, attendance) => {
    const dateFormatted = moment(attendance.date).format(dateFormatStr);
    acc[dateFormatted] = (acc[dateFormatted] || 0) + 1;
    return acc;
  }, {});

  const datesArray = generateDateArray({ start, end });

  const attendanceFormatted = datesArray.map((day) => {
    const dateFormatted = moment(day).format(dateFormatStr);
    return { date: dateFormatted, count: attendanceMap[dateFormatted] || 0 };
  });

  return attendanceFormatted;
};

const getPaymentTrends = async () => {
  const { start, end } = generateHalfYearlyDateRange();

  const payments = await prismaClient.payment.findMany({
    where: { createdAt: { gte: start, lte: end } },
    select: { amount: true, createdAt: true },
  });

  const dateFormatStr = 'MMM-YYYY';

  const paymentMap = payments.reduce((acc: Record<string, number>, payment) => {
    const month = moment(payment.createdAt).format(dateFormatStr);
    acc[month] = (acc[month] || 0) + payment.amount;
    return acc;
  }, {});

  const monthsArray = generateHalfYearArray();
  const paymentTrends = monthsArray.map((month) => ({ month, amount: paymentMap[month] || 0 }));

  return paymentTrends;
};

export const metaDataService = { getAttendanceSummary, getAttendanceTrends, getPaymentTrends };
