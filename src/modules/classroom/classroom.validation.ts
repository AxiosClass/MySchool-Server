import { z } from 'zod';

const createClassroom = z.object({
  name: z.string().min(1, { message: 'Classroom name is required' }),
  classId: z.string().min(1, { message: 'Class is required' }),
  classTeacherId: z.string().min(1, { message: 'Teacher is required' }),
});

const assignSubjectTeacher = z.object({
  classSubjectId: z.string().min(1, { message: 'Subject id is required' }),
  teacherId: z.string().min(1, { message: 'Teacher id is required' }),
});

export const classroomValidation = { createClassroom, assignSubjectTeacher };

export type TCreateClassroomPayload = z.infer<typeof createClassroom>;
export type TAssignSubjectTeacher = z.infer<typeof assignSubjectTeacher>;
