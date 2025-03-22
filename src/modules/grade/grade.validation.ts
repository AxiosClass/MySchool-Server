import { z } from 'zod';

const addOrUpdateGradeSchema = z.object({
  subjectId: z.string({ required_error: 'Subject Id is required' }),
  examId: z.string({ required_error: 'Exam Id is required' }),
  studentId: z.string({ required_error: 'Student Id is required' }),
  marks: z.number({ required_error: 'Marks is required' }).positive({ message: 'Invalid Makrs' }),
});

type TAddOrUpdateGradePayload = z.infer<typeof addOrUpdateGradeSchema>;

export const gradeValidation = { addOrUpdateGradeSchema };
export type { TAddOrUpdateGradePayload };
