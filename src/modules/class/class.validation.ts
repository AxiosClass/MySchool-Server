import { z } from 'zod';

const addClassSchema = z.object({
  name: z.string().min(1, { message: 'Class Name is required' }),
  level: z.string().min(1, { message: 'Level is required' }),
  monthlyFee: z.number().positive({ message: 'Monthly fee can not be negative' }),
  termFee: z.number().positive({ message: 'Term fee can not be negative' }),
  admissionFee: z.number().positive({ message: 'Admission fee can not be negative' }),
});

const assignClassSubjectsSchema = z.object({
  subjectIds: z.string().min(1, 'SubjectId is too short').array().min(1, 'Minimum send one subject'),
  classId: z.string().min(1, { message: 'Class ID is required' }),
});

type TAddClassPayload = z.infer<typeof addClassSchema>;
type TAssignClassSubjectsPayload = z.infer<typeof assignClassSubjectsSchema>;

export const classValidation = { addClassSchema, assignClassSubjectsSchema };
export { TAddClassPayload, TAssignClassSubjectsPayload };
