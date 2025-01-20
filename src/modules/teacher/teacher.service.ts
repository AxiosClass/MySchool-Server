import { encryptPassword } from '../../helpers/encryptionHelper';
import { TAddTeacherPayload } from './teacher.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';

const addTeacher = async (payload: TAddTeacherPayload) => {
  const encryptedPassword = await encryptPassword(payload.nid);
  const teacher = await prismaClient.teacher.create({ data: { ...payload, password: encryptedPassword } });

  if (!teacher) throw new AppError('Failed to create a teacher', 400);
  return 'Teacher created successfully';
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

const getTeacherList = async () => {
  const teachers = await prismaClient.teacher.findMany({ select: { id: true, name: true } });
  return teachers;
};

export const teacherService = { addTeacher, getTeachers, getTeacherList };
