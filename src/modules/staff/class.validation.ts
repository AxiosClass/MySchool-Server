import { addressSubSchema } from '../../global/global.validation';
import { dateGenerator, enumGenerator } from '../../helpers';
import { bloodGroups } from '../../global/global.constants';
import { z } from 'zod';

const educationSubSchema = z.object(
  {
    name: z
      .string({ required_error: 'Degree name is required' })
      .min(1, { message: 'Degree name is required' }),
    passingYear: z
      .string({ required_error: 'Passing Year is required' })
      .length(4, { message: 'passing year is required' }),
    result: z
      .string({ required_error: 'Result is required' })
      .min(1, { message: 'Result is required' }),
    dept: z.string().optional(),
  },
  { required_error: 'Education is required' },
);

// main schema
export const addTeacher = z.object({
  userId: z
    .string({ required_error: 'Teacher id required' })
    .min(1, { message: 'Teacher id required' }),
  name: z
    .string({ required_error: 'Name is required' })
    .min(1, { message: 'Name is required' }),
  nid: z
    .string({ required_error: 'Nid is required' })
    .min(1, { message: 'Nid is required' }),
  phone: z
    .string({ required_error: 'Phone Number is required' })
    .min(1, { message: 'Phone Number is required' }),
  dob: dateGenerator('Date of birth is required'),
  bloodGroup: enumGenerator(bloodGroups, 'Invalid blood group'),
  salary: z
    .number({ required_error: 'Salary is required' })
    .min(0, { message: 'Invalid Salary' }),
  designation: z
    .string({ required_error: 'Designation is required' })
    .min(1, { message: 'Designation is required' }),
  address: addressSubSchema,
  education: educationSubSchema,
});

export type TAddTeacherPayload = z.infer<typeof addTeacher>;
