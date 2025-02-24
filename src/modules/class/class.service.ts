import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import type { TAddClassPayload, TAssignSubjectsPayload } from './class.validation';

const addClass = async (payload: TAddClassPayload) => {
  const isClassExist = await prismaClient.class.findFirst({
    where: { OR: [{ level: payload.level }, { name: payload.name }] },
  });

  if (isClassExist) throw new AppError('Class already exist', 400);

  const classInfo = await prismaClient.class.create({ data: { ...payload } });
  if (!classInfo) throw new AppError('Failed to add class', 400);

  return classInfo;
};

const getClasses = () => {
  return prismaClient.class.findMany({
    select: {
      id: true,
      name: true,
      level: true,
      admissionFee: true,
      monthlyFee: true,
      subjects: { select: { id: true, name: true } },
      classrooms: { select: { id: true, students: { select: { id: true } } } },
    },
  });
};

const getClassDetails = async (classId: string) => {
  const classInfo = await prismaClient.class.findUnique({
    where: { id: classId },
    select: {
      id: true,
      name: true,
      level: true,
      classrooms: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          classTeacher: { select: { id: true, name: true } },
          students: { select: { id: true } },
        },
      },
    },
  });

  if (!classInfo) throw new AppError('No Class found!', 400);
  return classInfo;
};

const getClassList = () => {
  return prismaClient.class.findMany({ select: { level: true, name: true } });
};

const getClassroomList = async (level: string) => {
  const classDetails = await prismaClient.class.findUnique({
    where: { level },
    select: { classrooms: { select: { id: true, name: true } } },
  });

  if (!classDetails) throw new AppError('Class not found', 404);
  return classDetails.classrooms;
};

export const classService = {
  addClass,
  getClasses,
  getClassDetails,
  getClassList,
  getClassroomList,
};
