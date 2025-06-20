import { z } from 'zod';
import { bloodGroups } from '../../global/global.constants';
import { enumGenerator } from '../../helpers/zodHelper';
import { wordCapitalize } from '../../helpers/common';

const educationSubSchema = z.object({
  degree: z.string().min(1, { message: 'Degree can not be empty' }),
  passedYear: z.string().min(4, { message: 'Invalid year' }),
});

const addTeacherSchema = z.object({
  id: z.string().min(1, { message: 'Teacher id can not be empty' }),

  name: z
    .string()
    .trim()
    .min(1, { message: 'Name can not be empty' })
    .transform((val) => wordCapitalize(val)),

  nid: z.string().min(1, { message: 'Nid can not be empty' }),
  phone: z.string().min(1, { message: 'Phone number can not be empty' }),
  dob: z.string().datetime({ message: 'Invalid date of birth' }),
  bloodGroup: enumGenerator(bloodGroups, 'Invalid blood group'),
  salary: z.number().positive({ message: 'Salary can not be negative' }),
  address: z.string().min(1, { message: 'Address cam not be empty' }),
  education: educationSubSchema,
});

const updateTeacherSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name can not be empty' })
    .transform((val) => wordCapitalize(val))
    .optional(),

  nid: z.string().min(1, { message: 'Nid can not be empty' }).optional(),
  phone: z.string().min(1, { message: 'Phone number can not be empty' }).optional(),
  dob: z.string().datetime({ message: 'Invalid date of birth' }).optional(),
  bloodGroup: enumGenerator(bloodGroups, 'Invalid blood group').optional(),
  salary: z.number().positive({ message: 'Salary can not be negative' }).optional(),
  address: z.string().min(1, { message: 'Address cam not be empty' }).optional(),
  education: educationSubSchema.partial().optional(),
});

// types
type TAddTeacherPayload = z.infer<typeof addTeacherSchema>;
type TUpdateTeacherPayload = z.infer<typeof updateTeacherSchema>;

export const teacherValidation = { addTeacherSchema, updateTeacherSchema };
export type { TAddTeacherPayload, TUpdateTeacherPayload };
