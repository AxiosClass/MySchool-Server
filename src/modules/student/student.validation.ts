import { z } from 'zod';
import { bloodGroups } from '../../global/global.constants';
import { dateGenerator, enumGenerator } from '../../helpers/zodHelper';

const parentSubSchema = z.object({
  fatherName: z.string().min(1, { message: 'Father name is required' }),
  motherName: z.string().min(1, { message: 'Mother name is required' }),
});

const guardianSubSchema = z.object({
  name: z.string().min(1, { message: 'Guardian name is required' }),
  phone: z.string().min(1, { message: 'Guardian phone number is required' }),
  relation: z.string().min(1, { message: 'Please provide relation with guardian' }),
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

const issueNfcCardSchema = z.object({
  cardId: z.string().min(1, 'Card id is required'),
  studentId: z.string().min(1, 'StudentId is required'),
});

type TAddStudentPayload = z.infer<typeof addStudentSchema>;
type TIssueNfcCardPayload = z.infer<typeof issueNfcCardSchema>;

export const studentValidation = { addStudentSchema, issueNfcCardSchema };
export { TAddStudentPayload, TIssueNfcCardPayload };
