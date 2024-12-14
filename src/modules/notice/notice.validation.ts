import { z } from 'zod';
import { enumGenerator } from '../../helpers/zodHelper';
import { NoticeFor } from '@prisma/client';

const createNotice = z.object({
  title: z.string({ required_error: 'Title is required' }).min(1, { message: 'Tittle is required' }),
  description: z.string({ required_error: 'Description is required' }).min(1, { message: 'Description is required' }),
  noticeFor: enumGenerator(Object.keys(NoticeFor), 'Please specify who is going to see notice'),
});

export const noticeValidation = { createNotice };

export type TCreateNoticePayload = z.infer<typeof createNotice> & { noticeFor: NoticeFor };
