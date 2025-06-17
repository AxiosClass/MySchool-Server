import { z } from 'zod';

const addDiscountSchema = z.object({
  amount: z
    .number({
      required_error: 'Discount amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be greater than 0'),

  description: z.string().max(255, 'Description must be 255 characters or fewer').optional().nullable(),

  studentId: z
    .string({
      required_error: 'Student ID is required',
    })
    .uuid('Invalid student ID format'),
});

type TAddDiscountPayload = z.infer<typeof addDiscountSchema>;

export const actionValidation = { addDiscountSchema };
export type { TAddDiscountPayload };
