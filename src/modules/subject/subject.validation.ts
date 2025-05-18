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

const assignSubjectsSchema = z.object({
  subjectIds: z.string().min(1, 'SubjectId is too short').array().min(1, 'Please provide minimum one subject'),
});

type TCreateSubjectPayload = z.infer<typeof createSubjectSchema>;
type TAssignSubjectsPayload = z.infer<typeof assignSubjectsSchema>;

export const subjectValidation = { createSubjectSchema, assignSubjectsSchema };
export { TCreateSubjectPayload, TAssignSubjectsPayload };
