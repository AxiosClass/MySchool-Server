import { z } from 'zod';

const addTermResultSchema = z.object({
  termId: z.string().min(1, { message: 'TermId is required' }),
  studentId: z.string().min(1, { message: 'StudentId is required' }),
  subjectId: z.string().min(1, { message: 'SubjectId is required' }),
  classroomId: z.string().min(1, { message: 'ClassroomId is required' }),
  marks: z.record(z.string(), z.number(), { message: 'Invalid marks format' }),
});

const cqMcqSchema = z.object({
  cq: z.number().positive().max(70, { message: 'Marks cannot exceed 70' }),
  mcq: z.number().positive().max(30, { message: 'Marks cannot exceed 30' }),
});

const cqMcqPracticalSchema = z.object({
  cq: z.number().positive().max(50, { message: 'Marks cannot exceed 50' }),
  mcq: z.number().positive().max(25, { message: 'Marks cannot exceed 25' }),
  practical: z.number().positive().max(25, { message: 'Marks cannot exceed 25' }),
});

const writtenFullSchema = z.object({
  written: z.number().positive().max(100, { message: 'Marks cannot exceed 100' }),
});

const writtenHalfSchema = z.object({
  written: z.number().positive().max(50, { message: 'Marks cannot exceed 50' }),
});

type TAddTermResultPayload = z.infer<typeof addTermResultSchema>;

export const termResultValidation = {
  addTermResultSchema,
  cqMcqSchema,
  cqMcqPracticalSchema,
  writtenFullSchema,
  writtenHalfSchema,
};

export type { TAddTermResultPayload };
