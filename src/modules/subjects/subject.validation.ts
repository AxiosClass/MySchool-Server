import { z } from 'zod';
import { SubjectType } from '@prisma/client';

const subjectSubSchema = z.object({
  name: z.string().min(1, 'Subject name is required').toUpperCase().trim(),
  type: z.nativeEnum(SubjectType),
  description: z.string().min(1, 'Description is too short').optional(),
});

const createSubjectSchema = subjectSubSchema.extend({
  children: subjectSubSchema.array().optional(),
});

const updateSubjectSchema = z.object({
  name: z.string().min(1, 'Subject name is too short').optional(),
  description: z.string().min(1, 'Description is too short').optional(),
  parentId: z.string().min(1, 'Parent id is too short').nullable().optional(),
});

type TCreateSubjectPayload = z.infer<typeof createSubjectSchema>;
type TUpdateSubjectPayload = z.infer<typeof updateSubjectSchema>;

export const subjectValidation = { createSubjectSchema, updateSubjectSchema };
export { TCreateSubjectPayload, TUpdateSubjectPayload };
