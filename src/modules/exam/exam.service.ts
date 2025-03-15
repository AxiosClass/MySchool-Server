import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { prismaClient } from '../../app/prisma';
import { TAddExamPayload, TUpdateExamPayload } from './exam.validation';
import { metaGenerator, paginationPropertyGenerator } from '../../helpers/common';
import { ExamStatus } from '@prisma/client';

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

const updateExam = async (examId: string, payload: TUpdateExamPayload) => {
  const isExamExist = await prismaClient.exam.findUnique({ where: { id: examId }, select: { status: true } });
  if (!isExamExist) throw new AppError('Exam not found', 404);

  const currentStatus = isExamExist?.status;

  // check if status is provided and if it is, check if it is allowed to be changed
  if (payload.status) {
    const examStatus = { [ExamStatus.PENDING]: 1, [ExamStatus.ONGOING]: 2, [ExamStatus.COMPLETED]: 3 };

    const currentStatusIndex = examStatus[currentStatus];
    const newStatusIndex = examStatus[payload?.status];
    if (currentStatusIndex > newStatusIndex) throw new AppError('Status can not be changed', 400);
  }

  await prismaClient.exam.update({ where: { id: examId }, data: payload });

  return 'Exam updated successfully';
};

const deleteExam = async (examId: string) => {
  const isExamExist = await prismaClient.exam.findUnique({ where: { id: examId }, select: { status: true } });
  if (!isExamExist) throw new AppError('Exam not found', 404);

  if (isExamExist.status !== ExamStatus.PENDING) throw new AppError('You are not allowed to delete this exam', 400);

  await prismaClient.exam.delete({ where: { id: examId } });
  return 'Exam deleted successfully';
};

export const examService = { addExam, getExams, updateExam, deleteExam };
