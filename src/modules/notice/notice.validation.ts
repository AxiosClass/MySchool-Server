import { NoticeFor } from '@prisma/client';
import { z } from 'zod';

// Create Notice Schema
export const createNotice = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, { message: 'Title cannot be empty' }),

  description: z
    .string({ required_error: 'Description is required' })
    .min(1, { message: 'Description cannot be empty' }),

  noticeFor: z.nativeEnum(NoticeFor, {
    required_error: 'Please specify who is going to see the notice',
    invalid_type_error: 'Invalid notice target',
  }),
});

// Update Notice Schema
export const updateNotice = z.object({
  title: z.string().min(1, { message: 'Title cannot be empty' }).optional(),
  description: z.string().min(1, { message: 'Description cannot be empty' }).optional(),

  noticeFor: z
    .nativeEnum(NoticeFor, {
      invalid_type_error: 'Invalid notice target',
    })
    .optional(),
});

type TCreateNoticePayload = z.infer<typeof createNotice> & { noticeFor: NoticeFor };
type TUpdateNoticePayload = z.infer<typeof updateNotice> & { noticeFor?: NoticeFor };

export const noticeValidation = { createNotice, updateNotice };
export { TCreateNoticePayload, TUpdateNoticePayload };
