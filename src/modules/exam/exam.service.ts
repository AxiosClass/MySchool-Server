import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';
import { TAddExamPayload } from './exam.validation';
import { TObject } from '../../utils/types';
import { metaGenerator, paginationPropertyGenerator } from '../../helpers/common';

const addExam = async (payload: TAddExamPayload) => {
  const isExamExists = await prismaClient.exam.findFirst({ where: { name: payload.name, year: payload.year } });
  if (isExamExists) throw new AppError('You have already created this exam', 400);

  const exam = await prismaClient.exam.create({
    data: { name: payload.name, year: payload.year, ...(payload.isOngoing && { status: 'ONGOING' }) },
    select: { id: true },
  });

  if (!exam.id) throw new AppError('Failed to create exam', 400);

  return 'Exam created successfully';
};

const getExams = async (query: TObject) => {
  const getAll = query.getAll === 'true';
  const year = Number(query.year);
  const { skip, limit, page } = paginationPropertyGenerator(query);

  const dbQuery = { ...(year && { year }) };

  const exams = await prismaClient.exam.findMany({
    where: dbQuery,
    orderBy: { createdAt: 'desc' },
    ...(!getAll && { skip, take: limit }),
  });

  const total = await prismaClient.exam.count({ where: dbQuery });
  return { exams, meta: metaGenerator({ page, limit, total }) };
};

export const examService = { addExam, getExams };
