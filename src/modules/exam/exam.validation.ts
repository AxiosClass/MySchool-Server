import { z } from 'zod';

const addExamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  year: z.number().min(2024, 'Invalid Year'),
  isOngoing: z.boolean().optional(),
});

const updateExamSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

type TAddExamPayload = z.infer<typeof addExamSchema>;
type TUpdateExamPayload = z.infer<typeof updateExamSchema>;

export const examValidation = { addExamSchema, updateExamSchema };
export type { TAddExamPayload, TUpdateExamPayload };
