import { TAddPaymentPayload } from '../transaction.validation';
import { generatePaymentId } from '../transaction.helpers';
import { prismaClient } from '../../../app/prisma';
import { PaymentType } from '@prisma/client';

export const addPayment = async (payload: TAddPaymentPayload) => {
  const { studentId, amount, date, type } = payload;
  const paymentId = generatePaymentId();

  const payment = await prismaClient.payment.create({
    data: { paymentId, studentId, type: type as PaymentType, amount, date },
  });

  return payment;
};
