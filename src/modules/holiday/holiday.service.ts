import moment from 'moment';

import { metaGenerator, paginationPropertyGenerator } from '../../helpers/common';
import { TAddHolidayPayload } from './holiday.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';

const addHoliday = async (payload: TAddHolidayPayload) => {
  const { startDate, endDate } = payload;

  if (startDate > endDate) throw new AppError('Start date can not be greated than end date', 400);
  const endDateEnd = moment(endDate).endOf('day').toDate();

  const holiday = await prismaClient.holiDay.create({
    data: { ...payload, endDate: endDateEnd },
    select: { id: true },
  });

  if (!holiday.id) throw new AppError('Failed to create holiday', 400);

  return 'Holiday created successfully';
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
