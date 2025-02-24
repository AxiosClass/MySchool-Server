import { z } from 'zod';
import { zodCapital } from '../../helpers/zodHelper';

const assignSubjectsSchema = z.object({
  subjects: zodCapital('Subject name is required').array().min(1, { message: 'Please select at least one subject' }),
  classId: z.string().min(1, { message: 'Class ID is required' }),
});

type TAssignSubjectsPayload = z.infer<typeof assignSubjectsSchema>;

export const subjectValidation = { assignSubjectsSchema };
export { TAssignSubjectsPayload };
