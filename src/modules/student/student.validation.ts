import { bloodGroups } from '../../global/global.constants';
import { z } from 'zod';
import { dateGenerator, enumGenerator } from '../../helpers/zodHelper';

const parentSubSchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
});

const guardianSubSchema = z.object({
  name: z.string().min(1, { message: 'Guardian name is required' }),
  phone: z.string().min(1, { message: 'Guardian phone number is required' }),
  relation: z
    .string()
    .min(1, { message: 'Please provide relation with guardian' }),
});

// main schemas
const addStudentSchema = z.object({
  name: z.string().min(1, { message: 'Student name is required.' }),
  birthId: z.string().min(1, { message: 'Student birth id is required.' }),
  dob: dateGenerator('Date of birth is required'),
  bloodGroup: enumGenerator(bloodGroups, 'Invalid blood group'),
  address: z.string().min(1, { message: 'Address is required' }),
  parents: parentSubSchema,
  guardian: guardianSubSchema,
  classroomId: z.string().min(1, { message: 'Student class id is required.' }),
});

export type TAddStudentPayload = z.infer<typeof addStudentSchema>;

export const studentValidation = { addStudentSchema };
