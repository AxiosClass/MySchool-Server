import { bloodGroups, divisions } from '../../global/constants';
import { dateGenerator, enumGenerator } from '../../helpers';
import { z } from 'zod';

// sub schema
export const addressSubSchema = z.object(
  {
    division: enumGenerator(divisions, 'Invalid Division'),
    district: z
      .string({ required_error: 'District is required' })
      .min(1, { message: 'District is required' }),
    subDistrict: z
      .string({ required_error: 'SubDistrict is required' })
      .min(1, { message: 'Sub District is required' }),
    postCode: z.string().optional(),
    village: z.string().optional(),
    streetAddress: z.string().optional(),
  },
  { required_error: 'Address is required' },
);

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
