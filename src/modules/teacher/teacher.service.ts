import { encryptPassword } from '../../helpers/encryptionHelper';
import { TAddTeacherPayload, TUpdateTeacherPayload } from './teacher.validation';
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
    isDeleted: false,
  };

  const teachers = await prismaClient.teacher.findMany({
    where,
    take: limit,
    skip,
    orderBy: { name: 'asc' },

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
  const teachers = await prismaClient.teacher.findMany({
    where: { isDeleted: false },
    select: { id: true, name: true },
  });

  return teachers;
};

const getTeacherDetails = async (teacherId: string) => {
  const teacher = await prismaClient.teacher.findUnique({
    where: { id: teacherId },
    select: {
      id: true,
      name: true,
      nid: true,
      phone: true,
      dob: true,
      bloodGroup: true,
      address: true,
      salary: true,
      education: true,
    },
  });

  if (!teacher) throw new AppError('Teacher not found', 404);
  return teacher;
};

const updateTeacher = async (payload: TUpdateTeacherPayload, teacherId: string) => {
  const teacher = await prismaClient.teacher.findUnique({ where: { id: teacherId }, select: { id: true } });
  if (!teacher) throw new AppError('Teacher not found', 404);

  await prismaClient.teacher.update({ where: { id: teacherId }, data: payload });
  return 'Teacher updated successfully';
};

const deleteTeacher = async (teacherId: string) => {
  const teacherInfo = await prismaClient.teacher.findUnique({
    where: { id: teacherId },
    select: {
      isDeleted: true,
      classroomsClassTeacher: { select: { id: true } },
      classroomSubjectTeacher: { select: { id: true } },
    },
  });

  if (!teacherInfo) throw new AppError('Teacher not found', 404);

  if (teacherInfo.classroomsClassTeacher)
    throw new AppError(`Can not delete this teacher as he is a class teacher of a section`, 400);

  if (teacherInfo.classroomSubjectTeacher.length)
    throw new AppError('Can not delete this teacher as he is subject teacher of at least a section', 400);

  await prismaClient.teacher.update({ where: { id: teacherId }, data: { isDeleted: true } });

  return 'Teacher has been deleted';
};

export const teacherService = {
  addTeacher,
  getTeachers,
  getTeacherList,
  getTeacherDetails,
  updateTeacher,
  deleteTeacher,
};
