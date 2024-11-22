import { TAddClassPayload } from './class.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';

const addClass = async (payload: TAddClassPayload) => {
  const classInfo = await prismaClient.class.create({ data: { ...payload } });
  if (!classInfo) throw new AppError('Failed to add class', 400);

  return classInfo;
};

export const classService = { addClass };
