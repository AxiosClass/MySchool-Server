import { ExamStatus } from '@prisma/client';
import { z } from 'zod';

// sub schemas
const yearSchema = z
  .number()
  .min(2024, 'Invalid Year')
  .refine((val) => new Date().getFullYear() <= val, 'Year cannot be less than the current year');

const addExamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  year: yearSchema,
  isOngoing: z.boolean().optional(),
  percentile: z.number().positive().max(100),
});

const updateExamSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  year: yearSchema.optional(),
  status: z.nativeEnum(ExamStatus, { message: 'Invalid Status' }).optional(),
  percentile: z.number().positive().max(100).optional(),
});

type TAddExamPayload = z.infer<typeof addExamSchema>;
type TUpdateExamPayload = z.infer<typeof updateExamSchema>;

export const examValidation = { addExamSchema, updateExamSchema };
export type { TAddExamPayload, TUpdateExamPayload };
