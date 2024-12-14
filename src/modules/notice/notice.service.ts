import { prismaClient } from '../../app/prisma';
import { TCreateNoticePayload } from './notice.validation';

const createNotice = async (payload: TCreateNoticePayload) => {
  const notice = await prismaClient.notice.create({ data: payload });
  return notice;
};

export const noticeService = { createNotice };
