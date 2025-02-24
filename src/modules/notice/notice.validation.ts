import { enumGenerator } from '../../helpers/zodHelper';
import { NoticeFor } from '@prisma/client';
import { z } from 'zod';

const createNotice = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, { message: 'Tittle is required' }),
  description: z.string({ required_error: 'Description is required' }).min(1, { message: 'Description is required' }),
  noticeFor: enumGenerator(Object.keys(NoticeFor), 'Please specify who is going to see notice'),
});

const updateNotice = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  noticeFor: enumGenerator(Object.keys(NoticeFor), 'Please Specify who is going to see notice').optional(),
});

type TCreateNoticePayload = z.infer<typeof createNotice> & { noticeFor: NoticeFor };
type TUpdateNoticePayload = z.infer<typeof updateNotice> & { noticeFor?: NoticeFor };

export const noticeValidation = { createNotice, updateNotice };
export { TCreateNoticePayload, TUpdateNoticePayload };
