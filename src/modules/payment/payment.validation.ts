import { z } from 'zod';
import { enumGenerator } from '../../helpers/zodHelper';
import { PaymentType } from '@prisma/client';

const takePaymentSchema = z.object({
  amount: z.number().min(0, { message: 'Amount can not be negative' }),
  month: z
    .number()
    .min(0, { message: 'Invalid month' })
    .max(11, { message: 'Invalid month' }),
  year: z.number().min(0, { message: 'Invalid Year' }),
  description: z.string().optional(),
  type: enumGenerator(Object.keys(PaymentType), 'Invalid payment type'),
  studentId: z.string().min(0, { message: 'Student id is required' }),
});

export type TTakePaymentPayload = z.infer<typeof takePaymentSchema>;

export const paymentValidation = { takePaymentSchema };
