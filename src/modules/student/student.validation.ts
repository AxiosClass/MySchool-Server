import { z } from 'zod';
import { bloodGroups } from '../../global/global.constants';
import { dateGenerator, enumGenerator } from '../../helpers/zodHelper';
import { wordCapitalize } from '../../helpers/common';

const parentSubSchema = z.object({
  fatherName: z
    .string()
    .trim()
    .min(1, { message: 'Father name is required' })
    .transform((v) => wordCapitalize(v)),

  motherName: z
    .string()
    .trim()
    .min(1, { message: 'Mother name is required' })
    .transform((v) => wordCapitalize(v)),
});

const guardianSubSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Guardian name is required' })
    .transform((v) => wordCapitalize(v)),

  phone: z.string().min(1, { message: 'Guardian phone number is required' }),
  relation: z.string().min(1, { message: 'Please provide relation with guardian' }),
});

// main schemas
const addStudentSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Student name is required.' })
    .transform((v) => wordCapitalize(v)),

  birthId: z.string().min(1, { message: 'Student birth id is required.' }),
  dob: z.string().datetime({ message: 'Invalid date' }),
  bloodGroup: enumGenerator(bloodGroups, 'Invalid blood group'),
  address: z.string().min(1, { message: 'Address is required' }),
  parents: parentSubSchema,
  guardian: guardianSubSchema,
  classroomId: z.string().min(1, { message: 'Student class id is required.' }),
});

const updateStudentSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Student name is required.' })
    .transform((v) => wordCapitalize(v))
    .optional(),

  birthId: z.string().min(1, { message: 'Student birth id is required.' }).optional(),
  dob: z.string().datetime({ message: 'Invalid date' }).optional(),
  bloodGroup: enumGenerator(bloodGroups, 'Invalid blood group').optional(),
  address: z.string().min(1, { message: 'Address is required' }).optional(),
  parents: parentSubSchema.partial().optional(),
  guardian: guardianSubSchema.partial().optional(),
});

const issueNfcCardSchema = z.object({
  cardId: z.string().min(1, 'Card id is required'),
  id: z.string().min(1, 'StudentId is required'),
});

type TAddStudentPayload = z.infer<typeof addStudentSchema>;
type TIssueNfcCardPayload = z.infer<typeof issueNfcCardSchema>;
type TUpdateStudentPayload = z.infer<typeof updateStudentSchema>;

export const studentValidation = { addStudentSchema, issueNfcCardSchema, updateStudentSchema };
export { TAddStudentPayload, TIssueNfcCardPayload, TUpdateStudentPayload };
