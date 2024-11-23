import { z } from 'zod';

const createClassroom = z.object({
  name: z.string().min(1, { message: 'Classroom name is required' }),
  classId: z.string().min(1, { message: 'Class is required' }),
  classTeacherId: z.string().min(1, { message: 'Teacher is required' }),
});

export type TCreateClassroomPayload = z.infer<typeof createClassroom>;

export const classroomValidation = { createClassroom };
