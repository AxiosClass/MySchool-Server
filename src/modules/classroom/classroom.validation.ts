import { z } from 'zod';

const createClassroom = z.object({
  name: z.string().min(1, { message: 'Classroom name is required' }),
  classId: z.string().min(1, { message: 'Class is required' }),
  classTeacherId: z.string().min(1, { message: 'Teacher is required' }),
});

const assignSubjectTeacher = z.object({
  classroomId: z.string().min(1, { message: 'Classroom id is required' }),
  classSubjectId: z.string().min(1, { message: 'Subject id is required' }),
  teacherId: z.string().min(1, { message: 'Teacher id is required' }),
});

const reassignSubjectTeacher = z.object({
  teacherId: z.string().min(1, { message: 'Teacher id is required' }),
});

type TCreateClassroomPayload = z.infer<typeof createClassroom>;
type TAssignSubjectTeacher = z.infer<typeof assignSubjectTeacher>;
type TReassignSubjectTeacher = z.infer<typeof reassignSubjectTeacher>;

export const classroomValidation = { createClassroom, assignSubjectTeacher, reassignSubjectTeacher };
export { TCreateClassroomPayload, TAssignSubjectTeacher, TReassignSubjectTeacher };
