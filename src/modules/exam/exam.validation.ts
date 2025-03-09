import { z } from 'zod';

const addExam = z.object({
  name: z.string().min(1, 'Name is required'),
  year: z.number().min(2024, 'Invalid Year'),
  isOngoing: z.boolean().optional(),
});

type TAddExamPayload = z.infer<typeof addExam>;

export const examValidation = { addExam };
export type { TAddExamPayload };
