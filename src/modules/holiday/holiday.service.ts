import moment from 'moment';

import { metaGenerator, paginationPropertyGenerator } from '../../helpers/common';
import { TAddHolidayPayload } from './holiday.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';

const addHoliday = async (payload: TAddHolidayPayload) => {
  const { startDate, endDate } = payload;

  if (startDate > endDate) throw new AppError('Start date can not be greater than end date', 400);
  const startDateStart = moment(startDate).endOf('day').toDate();
  const endDateEnd = moment(endDate).endOf('day').toDate();

  const message = await prismaClient.$transaction(async (tClient) => {
    await tClient.holiDay.create({
      data: { ...payload, startDate: startDateStart, endDate: endDateEnd },
      select: { id: true },
    });

    await tClient.notice.create({
      data: {
        title: payload.name,
        description:
          payload.description ??
          `School shall remain close form ${moment(payload.startDate).format('DD MMM YYYY')} to ${moment(payload.endDate).format('DD MMM YYYY')}`,
        noticeFor: 'ALL',
      },
    });

    return 'Holiday created successfully';
  });

  return message;
};

const getHolidays = async (query: TObject) => {
  const getAll = query.getAll === 'true';
  const search = query.search;
  const { skip, limit, page } = paginationPropertyGenerator(query);

  const dbQuery = { ...(search && { name: { contains: search } }) };

  const holidays = await prismaClient.holiDay.findMany({
    where: dbQuery,
    orderBy: { startDate: 'desc' },
    ...(!getAll && { skip, take: limit }),
  });

  const total = await prismaClient.holiDay.count({ where: dbQuery });

  return { holidays, meta: metaGenerator({ page, limit, total }) };
};

export const holidayService = { addHoliday, getHolidays };
