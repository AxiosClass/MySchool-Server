import { z } from 'zod';
import { zodCapital } from '../../helpers/zodHelper';

const addClassSchema = z.object({
  name: z.string().min(1, { message: 'Class Name is required' }),
  level: z.string().min(1, { message: 'Level is required' }),
  monthlyFee: z.number().positive({ message: 'Monthly fee can not be negative' }),
  admissionFee: z.number().positive({ message: 'Admission fee can not be negative' }),
});

const assignSubjectsSchema = z.object({
  subjects: zodCapital('Subject name is required').array().min(1, { message: 'Please select at least one subject' }),
  classId: z.string().min(1, { message: 'Class ID is required' }),
});

export type TAddClassPayload = z.infer<typeof addClassSchema>;
export type TAssignSubjectsPayload = z.infer<typeof assignSubjectsSchema>;

export const classValidation = { addClassSchema, assignSubjectsSchema };
