import { z } from 'zod';

// Sub Schema
const mediaSubSchema = z.object({
  id: z.string({ required_error: 'Media ID is required' }).min(1, 'Media ID cannot be empty'),
  type: z.string({ required_error: 'Media type is required' }).min(1, 'Media type cannot be empty'),

  url: z
    .string({ required_error: 'Media URL is required' })
    .min(1, 'Media URL cannot be empty')
    .url('Invalid URL format'),
});

const createClassroomSchema = z.object({
  name: z.string({ required_error: 'Classroom name is required' }).trim().min(1, 'Classroom name cannot be empty'),

  classId: z
    .string({ required_error: 'Class is required' })
    .trim()
    .uuid({ message: 'Invalid ClassId' })
    .min(1, 'Class ID cannot be empty'),

  classTeacherId: z.string({ required_error: 'Teacher is required' }).trim().min(1, 'Teacher ID cannot be empty'),
});

const assignSubjectTeacherSchema = z.object({
  classroomId: z
    .string({ required_error: 'Classroom ID is required' })
    .uuid({ message: 'Invalid Classroom ID (must be UUID)' }),

  subjectId: z
    .string({ required_error: 'Subject ID is required' })
    .uuid({ message: 'Invalid Subject ID (must be UUID)' }),

  teacherId: z
    .string({ required_error: 'Teacher ID is required' })
    .trim()
    .min(1, { message: 'Teacher ID cannot be empty' }),
});

const addNoteSchema = z.object({
  title: z.string({ required_error: 'Title is required' }).trim().min(1, 'Title cannot be empty'),
  description: z.string().trim().min(1, 'Description cannot be empty').optional(),

  classroomId: z
    .string({ required_error: 'Classroom ID is required' })
    .uuid({ message: 'Invalid Classroom ID (must be UUID)' }),

  subjectId: z.string().uuid({ message: 'Invalid Subject ID (must be UUID)' }).optional(),
  media: z.array(mediaSubSchema).optional(),
});

const updateNoteSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty').optional(),
  description: z.string().trim().min(1, 'Description cannot be empty').optional(),
  subjectId: z.string().uuid({ message: 'Invalid Subject ID (must be UUID)' }).optional(),

  media: z.object({
    old: z.array(mediaSubSchema).default([]),
    new: z.array(mediaSubSchema).default([]),
  }),
});

const updateClassroomSchema = z.object({
  name: z.string().min(1, { message: 'Section name can not be empty' }).optional(),
  classTeacherId: z.string().min(1, { message: 'Please add a teacher' }).optional(),
});

type TCreateClassroomPayload = z.infer<typeof createClassroomSchema>;
type TAssignSubjectTeacherPayload = z.infer<typeof assignSubjectTeacherSchema>;
type TAddNotePayload = z.infer<typeof addNoteSchema>;
type TUpdateNotePayload = z.infer<typeof updateNoteSchema>;
type TUpdateClassroomPayload = z.infer<typeof updateClassroomSchema>;

export const classroomValidation = {
  createClassroomSchema,
  assignSubjectTeacherSchema,
  addNoteSchema,
  updateNoteSchema,
  updateClassroomSchema,
};

export {
  TCreateClassroomPayload,
  TAssignSubjectTeacherPayload,
  TAddNotePayload,
  TUpdateNotePayload,
  TUpdateClassroomPayload,
};
