import { z } from 'zod';
import { PaymentType } from '@prisma/client';
import { enumGenerator } from '../../helpers/zodHelper';

const takePaymentSchema = z
  .object({
    amount: z.number().min(0, { message: 'Amount can not be negative' }),
    month: z.number().optional(),
    classId: z.string().min(1, { message: 'ClassId is required' }),
    year: z.number().min(0, { message: 'Invalid Year' }),
    description: z.string().optional(),
    type: enumGenerator(Object.keys(PaymentType), 'Invalid payment type'),
    studentId: z.string().min(0, { message: 'Student id is required' }),
  })
  .superRefine((value, ctx) => {
    if (value.type === PaymentType.MONTHLY_FEE && !value.month)
      ctx.addIssue({ code: 'custom', message: 'Month is required', path: ['month'] });

    if (value.month && (value.month < 0 || value.month > 11))
      ctx.addIssue({ code: 'custom', message: 'Invalid month', path: ['moth'] });
  });

type TTakePaymentPayload = z.infer<typeof takePaymentSchema> & { type: PaymentType };

export const paymentValidation = { takePaymentSchema };
export { TTakePaymentPayload };
