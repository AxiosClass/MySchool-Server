import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { generateRandomCharacter } from '../../helpers/uniqueIdHelper';
import { TAddTeacherPayload } from './teacher.validation';

const addTeacher = async (payload: TAddTeacherPayload) => {
  const password = generateRandomCharacter(4);
  const teacher = await prismaClient.teacher.create({
    data: { ...payload, password },
  });

  if (!teacher) throw new AppError('Failed to create a teacher', 400);

  return teacher;
};

export const teacherService = { addTeacher };
