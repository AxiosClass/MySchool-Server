import { z } from 'zod';
import { SubjectType } from '@prisma/client';

const subjectSubSchema = z.object({
  name: z.string().min(1, 'Subject name is required').toUpperCase().trim(),
  type: z.nativeEnum(SubjectType),
  description: z.string().min(1, 'Too Short description').optional(),
});

const createSubjectSchema = subjectSubSchema.extend({
  children: subjectSubSchema.array().optional(),
});

type TCreateSubjectPayload = z.infer<typeof createSubjectSchema>;

export const subjectValidation = { createSubjectSchema };
export { TCreateSubjectPayload };
