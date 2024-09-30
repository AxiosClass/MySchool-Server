import { addressSubSchema } from '../../global/global.validation';
import { dateGenerator, enumGenerator } from '../../helpers';
import { bloodGroups } from '../../global/global.constants';
import { z } from 'zod';

// sub schemas
const personSubSchema = (required_error: string) => {
  return z.object(
    {
      name: z
        .string({ required_error: 'Parent name is required.' })
        .min(1, { message: 'Parent name is required.' }),
      nid: z
        .string({ required_error: 'Parent NID is required.' })
        .min(1, { message: 'Parent NID is required.' }),
      phone: z
        .string({ required_error: 'Parent phone number is required.' })
        .min(1, { message: 'Parent phone number is required.' }),
    },
    { required_error },
  );
};

const parentSubSchema = z.object(
  {
    father: personSubSchema('Father information is required'),
    mother: personSubSchema('Mother information is required'),
  },
  { required_error: 'Parent Information is required' },
);

const guardianSubSchema = z.object({
  name: z
    .string({ required_error: 'Guardian name is required.' })
    .min(1, { message: 'Guardian name is required.' }),
  nid: z
    .string({ required_error: 'Guardian NID is required.' })
    .min(1, { message: 'Guardian NID is required.' }),
  phone: z
    .string({ required_error: 'Guardian phone number is required.' })
    .min(1, { message: 'Guardian phone number is required.' }),
  relation: z
    .string({ required_error: 'Guardian relation is required.' })
    .min(1, { message: 'Guardian relation is required.' }),
});

// main schemas
export const addStudentSchema = z.object({
  name: z
    .string({ required_error: 'Student name is required.' })
    .min(1, { message: 'Student name is required.' }),
  birthId: z
    .string({ required_error: 'Student birth id is required.' })
    .min(1, { message: 'Student birth id is required.' }),
  class: z
    .string({ required_error: 'Student class is required.' })
    .min(1, { message: 'Student class is required.' }),
  classId: z
    .string({ required_error: 'Student class id is required.' })
    .min(1, { message: 'Student class id is required.' }),
  dob: dateGenerator('Date of birth is required'),
  bloodGroup: enumGenerator(bloodGroups, 'Blood group is required'),
  parents: parentSubSchema,
  guardian: guardianSubSchema,
  address: addressSubSchema,
});

export type TAddStudentPayload = z.infer<typeof addStudentSchema>;
