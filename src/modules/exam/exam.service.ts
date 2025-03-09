import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';
import { TAddExamPayload } from './exam.validation';

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

export const examService = { addExam };
