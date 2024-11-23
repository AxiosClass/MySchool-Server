import { z } from 'zod';
import { bloodGroups } from '../../global/global.constants';
import { enumGenerator } from '../../helpers/zodHelper';
import { isValidDate } from '../../helpers/common';

const educationSubSchema = z.object({
  degree: z.string().min(1, { message: 'Degree name is required' }),
  passedYear: z.string().min(4, { message: 'Passed year is required' }),
});

const addTeacherSchema = z.object({
  id: z.string().min(1, { message: 'Teacher id is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
  nid: z.string().min(1, { message: 'Nid is required' }),
  phone: z.string().min(1, { message: 'Phone number is required' }),
  dob: z
    .string()
    .refine((date) => isValidDate(date), { message: 'Invalid date of birth' }),
  bloodGroup: enumGenerator(bloodGroups, 'Invalid blood group'),
  salary: z.number().min(0, { message: 'Salary can not be negative' }),
  address: z.string().min(1, { message: 'Address is required' }),
  education: educationSubSchema,
});

// types
export type TAddTeacherPayload = z.infer<typeof addTeacherSchema>;

export const teacherValidation = { addTeacherSchema };
