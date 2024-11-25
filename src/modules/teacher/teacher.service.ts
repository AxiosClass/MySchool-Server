import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { generateRandomCharacter } from '../../helpers/uniqueIdHelper';
import { encryptPassword } from '../../helpers/encryptionHelper';
import { TAddTeacherPayload } from './teacher.validation';

const addTeacher = async (payload: TAddTeacherPayload) => {
  const password = generateRandomCharacter(4);
  const encryptedPassword = await encryptPassword(password);
  const teacher = await prismaClient.teacher.create({ data: { ...payload, password: encryptedPassword } });

  if (!teacher) throw new AppError('Failed to create a teacher', 400);
  return { password };
};

const getTeachers = async () => {
  const teacher = await prismaClient.teacher.findMany({
    select: {
      id: true,
      name: true,
      phone: true,
      salary: true,
      classroomsClassTeacher: { select: { name: true, class: { select: { level: true } } } },
      joinedAt: true,
    },
  });

  return teacher;
};

export const teacherService = { addTeacher, getTeachers };
