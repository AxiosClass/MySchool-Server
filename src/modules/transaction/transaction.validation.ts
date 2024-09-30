import { z } from 'zod';
import { dateGenerator, enumGenerator } from '../../helpers';
import { PaymentType } from '@prisma/client';

export const addPaymentSchema = z.object({
  studentId: z
    .string({ required_error: 'StudentId is required' })
    .min(1, { message: 'StudentId is required' }),
  type: enumGenerator(Object.keys(PaymentType), 'Payment Type is required'),
  amount: z
    .number({ required_error: 'Amount is required' })
    .min(100, { message: 'Minimum amount is 100 Taka' }),
  date: dateGenerator('Date is required'),
});

export type TAddPaymentPayload = z.infer<typeof addPaymentSchema>;
