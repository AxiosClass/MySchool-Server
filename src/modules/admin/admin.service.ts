import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TCreateAdminPayload } from './admin.validation';

const createAdmin = async (payload: TCreateAdminPayload) => {
  const isAdminExists = await prismaClient.admin.findUnique({ where: { id: payload.email }, select: { id: true } });
  if (isAdminExists) throw new AppError('Admin already exists', 400);
};
