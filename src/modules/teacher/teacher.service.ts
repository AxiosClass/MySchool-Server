import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { generateRandomCharacter } from '../../helpers/uniqueIdHelper';
import { encryptPassword } from '../../helpers/encryptionHelper';
import { TAddTeacherPayload } from './teacher.validation';

const addTeacher = async (payload: TAddTeacherPayload) => {
  const password = generateRandomCharacter(4);
  const encryptedPassword = await encryptPassword(password);
  const teacher = await prismaClient.teacher.create({
    data: { ...payload, password: encryptedPassword },
  });

  if (!teacher) throw new AppError('Failed to create a teacher', 400);

  return { password };
};

export const teacherService = { addTeacher };
