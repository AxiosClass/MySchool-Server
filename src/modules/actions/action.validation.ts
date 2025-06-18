import { z } from 'zod';

const addDiscountSchema = z.object({
  amount: z
    .number({
      required_error: 'Discount amount is required',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be greater than 0'),

  description: z.string().max(255, 'Description must be 255 characters or fewer').optional().nullable(),
  studentId: z.string({ required_error: 'Student ID is required' }),
});

export const promoteStudentSchema = z.object({
  studentId: z.string().min(1, { message: 'Student ID is required' }).trim(),
  classLevel: z.string().min(1, { message: 'Class level is required' }).trim(),
  classroomId: z.string().uuid({ message: 'Invalid classroom ID format' }),
});

type TAddDiscountPayload = z.infer<typeof addDiscountSchema>;
type TPromotedStudentPayload = z.infer<typeof promoteStudentSchema>;

export const actionValidation = { addDiscountSchema, promoteStudentSchema };
export type { TAddDiscountPayload, TPromotedStudentPayload };
