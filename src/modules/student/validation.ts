import { z } from 'zod';
import { addressSubSchema } from '../staff/validation';
import { bloodGroups } from '../../global/constants';

const parentsSchema = z.object({
  name: z.string({ required_error: 'Parent name is required.' }),
  nid: z.string({ required_error: 'Parent NID is required.' }),
  phone: z.string({ required_error: 'Parent phone number is required.' }),
  relation: z.string({ required_error: 'Parent relation is required.' }),
});
const guardianSchema = z.object({
  name: z.string({ required_error: 'Guardian name is required.' }),
  nid: z.string({ required_error: 'Guardian NID is required.' }),
  phone: z.string({ required_error: 'Guardian phone number is required.' }),
  relation: z.string({ required_error: 'Guardian relation is required.' }),
});

export const addStudentSchema = z.object({
  name: z.string({ required_error: 'Student name is required.' }),
  birthId: z.string({ required_error: 'Student birth id is required.' }),
  class: z.string({ required_error: 'Student class is required.' }),
  classId: z.string({ required_error: 'Student class id is required.' }),
  dob: z.string({ required_error: 'Student date of birth is required.' }),
  bloodGroup: z.enum([...(bloodGroups as [string, ...string[]])]),
  parents: parentsSchema,
  guardian: guardianSchema,
  address: addressSubSchema,
});

export type TAddStudentPayload = z.infer<typeof addStudentSchema>;
