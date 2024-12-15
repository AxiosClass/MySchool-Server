import { exactMatchPicker, metaGenerator, partialMatchPicker } from '../../helpers/common';
import { TCreateNoticePayload, TUpdateNoticePayload } from './notice.validation';
import { prismaClient } from '../../app/prisma';

const createNotice = async (payload: TCreateNoticePayload) => {
  const notice = await prismaClient.notice.create({ data: payload });
  return notice;
};

const getNotices = async (query: Record<string, any>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const exactMatch = exactMatchPicker(['noticeFor', 'id'], query);
  const partialMatch = partialMatchPicker(['title', 'description'], query);

  const notices = await prismaClient.notice.findMany({
    where: { ...exactMatch, ...partialMatch },
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prismaClient.notice.count({ where: { ...exactMatch, ...partialMatch } });

  return { notices, meta: metaGenerator({ page, limit, total }) };
};

const updateNotice = async (payload: TUpdateNoticePayload, noticeId: string) => {
  const notice = await prismaClient.notice.update({ where: { id: noticeId }, data: { ...payload } });
  return notice;
};

export const noticeService = { createNotice, getNotices, updateNotice };
