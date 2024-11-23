import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TCreateClassroomPayload } from './classroom.validation';

const createClassroom = async (payload: TCreateClassroomPayload) => {
  await prismaClient.classroom.create({ data: { ...payload } });
  return 'Classroom is created successfully';
};

export const classroomService = { createClassroom };
