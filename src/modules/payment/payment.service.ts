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

export const paymentService = { takePayment };
