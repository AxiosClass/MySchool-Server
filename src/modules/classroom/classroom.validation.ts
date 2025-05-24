import { MediaType } from '@prisma/client';
import { z } from 'zod';

const createClassroomSchema = z.object({
  name: z.string().min(1, { message: 'Classroom name is required' }),
  classId: z.string().min(1, { message: 'Class is required' }),
  classTeacherId: z.string().min(1, { message: 'Teacher is required' }),
});

const assignSubjectTeacherSchema = z.object({
  classroomId: z.string().min(1, { message: 'Classroom id is required' }),
  subjectId: z.string().min(1, { message: 'Subject id is required' }),
  teacherId: z.string().min(1, { message: 'Teacher id is required' }),
});

const mediaSubSchema = z.object({
  id: z.string().min(1, 'Media Id is required'),
  type: z.nativeEnum(MediaType, { message: 'Invalid media type' }),
  url: z.string().min(1, 'Media url is required'),
});

const addNoteSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }).optional(),
  classroomId: z.string().min(1, { message: 'Classroom id is required' }),
  media: mediaSubSchema.array().optional(),
});

type TCreateClassroomPayload = z.infer<typeof createClassroomSchema>;
type TAssignSubjectTeacherPayload = z.infer<typeof assignSubjectTeacherSchema>;
type TAddNotePayload = z.infer<typeof addNoteSchema>;

export const classroomValidation = { createClassroomSchema, assignSubjectTeacherSchema, addNoteSchema };
export { TCreateClassroomPayload, TAssignSubjectTeacherPayload, TAddNotePayload };
