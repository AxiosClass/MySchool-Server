import { encryptPassword } from '../../helpers/encryptionHelper';
import { TAddTeacherPayload } from './teacher.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { getMeta, getPaginationInfo } from '../../helpers/common';
import { Prisma } from '@prisma/client';

const addTeacher = async (payload: TAddTeacherPayload) => {
  const encryptedPassword = await encryptPassword(payload.nid);
  const teacher = await prismaClient.teacher.create({ data: { ...payload, password: encryptedPassword } });

  if (!teacher) throw new AppError('Failed to create a teacher', 400);
  return 'Teacher created successfully';
};

const getTeachers = async (query: TObject) => {
  const searchTerm = query.searchTerm;

  const { page, limit, skip } = getPaginationInfo(query);

  const where: Prisma.TeacherWhereInput = {
    ...(searchTerm && {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { id: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }),
  };

  const teachers = await prismaClient.teacher.findMany({
    where,
    select: {
      id: true,
      name: true,
      phone: true,
      salary: true,
      classroomsClassTeacher: { select: { name: true, class: { select: { level: true } } } },
      joinedAt: true,
    },
  });

  const teacherCount = await prismaClient.teacher.count({ where });
  const meta = getMeta({ page, limit, total: teacherCount });

  const formattedTeachers = teachers.map((teacher) => {
    const { classroomsClassTeacher, ...rest } = teacher;
    return { ...rest, classroomName: classroomsClassTeacher?.name, classLevel: classroomsClassTeacher?.class.level };
  });

  return { meta, teachers: formattedTeachers };
};

const getTeacherList = async () => {
  const teachers = await prismaClient.teacher.findMany({ select: { id: true, name: true } });
  return teachers;
};

export const teacherService = { addTeacher, getTeachers, getTeacherList };
