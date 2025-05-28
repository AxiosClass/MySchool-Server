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
  type: z.string().min(1, { message: 'Media type is required' }),
  url: z.string().min(1, 'Media url is required'),
});

const addNoteSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }).optional(),
  classroomId: z.string().min(1, { message: 'Classroom id is required' }),
  media: mediaSubSchema.array().optional(),
});

const updateNoteSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  description: z.string().min(1, { message: 'Description is required' }).optional(),
  media: z.object({
    old: mediaSubSchema.array(),
    new: mediaSubSchema.array(),
  }),
});

type TCreateClassroomPayload = z.infer<typeof createClassroomSchema>;
type TAssignSubjectTeacherPayload = z.infer<typeof assignSubjectTeacherSchema>;
type TAddNotePayload = z.infer<typeof addNoteSchema>;
type TUpdateNotePayload = z.infer<typeof updateNoteSchema>;

export const classroomValidation = {
  createClassroomSchema,
  assignSubjectTeacherSchema,
  addNoteSchema,
  updateNoteSchema,
};

export { TCreateClassroomPayload, TAssignSubjectTeacherPayload, TAddNotePayload, TUpdateNotePayload };
