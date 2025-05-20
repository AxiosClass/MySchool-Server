import { z } from 'zod';

const createClassroom = z.object({
  name: z.string().min(1, { message: 'Classroom name is required' }),
  classId: z.string().min(1, { message: 'Class is required' }),
  classTeacherId: z.string().min(1, { message: 'Teacher is required' }),
});

const assignSubjectTeacher = z.object({
  classroomId: z.string().min(1, { message: 'Classroom id is required' }),
  subjectId: z.string().min(1, { message: 'Subject id is required' }),
  teacherId: z.string().min(1, { message: 'Teacher id is required' }),
});

const reassignSubjectTeacher = z.object({
  teacherId: z.string().min(1, { message: 'Teacher id is required' }),
});

export const uploadMaterialValidation = z.object({
  title: z.string(),
  description: z.string().optional(),
  classroomId: z.string(),
});

type TCreateClassroomPayload = z.infer<typeof createClassroom>;
type TAssignSubjectTeacher = z.infer<typeof assignSubjectTeacher>;
type TReassignSubjectTeacher = z.infer<typeof reassignSubjectTeacher>;
type TUploadMaterialPayload = z.infer<typeof uploadMaterialValidation>;

export const classroomValidation = {
  createClassroom,
  assignSubjectTeacher,
  reassignSubjectTeacher,
  uploadMaterialValidation,
};
export { TCreateClassroomPayload, TAssignSubjectTeacher, TReassignSubjectTeacher, TUploadMaterialPayload };
