import { TTakePaymentPayload } from './payment.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';

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
      classroom: { select: { id: true, name: true } },
      guardian: true,
      status: true,
    },
  });

  const totalPaid = await prismaClient.payment.aggregate({ where: { studentId }, _sum: { amount: true } });
  return { info: { ...studentInfo }, totalPaid };
};

export const paymentService = { takePayment, getPaymentSummary };
