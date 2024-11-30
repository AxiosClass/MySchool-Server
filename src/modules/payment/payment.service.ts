import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';
import { TTakePaymentPayload } from './payment.validation';
import { calculateMonthsBetween } from '../../helpers/common';

const takePayment = async (payload: TTakePaymentPayload) => {
  const payment = await prismaClient.payment.create({
    data: { ...payload },
    select: { id: true },
  });

  if (!payment) throw new AppError('Failed to take payment', 400);

  return payment;
};

const getPaymentSummary = async (studentId: string) => {
  const studentInfo = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      name: true,
      class: true,
      classroom: { select: { id: true, name: true, class: { select: { monthlyFee: true, admissionFee: true } } } },
      guardian: true,
      status: true,
      admittedAt: true,
    },
  });

  if (!studentInfo) return null;

  // calculating total due
  const totalMonthSinceAdmitted = calculateMonthsBetween(new Date(studentInfo?.admittedAt), new Date());
  let totalDue =
    (studentInfo.classroom.class.admissionFee || 0) +
    (studentInfo.classroom.class.monthlyFee || 0) * totalMonthSinceAdmitted;

  const totalPaid = await prismaClient.payment.aggregate({ where: { studentId }, _sum: { amount: true } });

  return { ...studentInfo, totalPaid: totalPaid._sum.amount || 0, totalDue };
};

export const paymentService = { takePayment, getPaymentSummary };
