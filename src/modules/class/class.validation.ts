import { z } from 'zod';

const addClassSchema = z.object({
  name: z.string().min(1, { message: 'Class Name is required' }),
  level: z.string().min(1, { message: 'Level is required' }),
  monthlyFee: z.number().positive({ message: 'Monthly fee can not be negative' }),
  admissionFee: z.number().positive({ message: 'Admission fee can not be negative' }),
});

const addOrRemoveSubjects = z.object({
  subjects: z
    .array(z.string().min(1, { message: 'Subject name is required' }))
    .min(1, { message: 'Subjects is required' }),
});

export type TAddClassPayload = z.infer<typeof addClassSchema>;
export type TAddOrRemoveSubjectsPayload = z.infer<typeof addOrRemoveSubjects>;

export const classValidation = { addClassSchema, addOrRemoveSubjects };
