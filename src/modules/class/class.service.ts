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

const getClasses = async () => {
  const classes = await prismaClient.class.findMany({
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

  return classes;
};

const assignSubject = async (payload: TAssignSubjectsPayload) => {
  const classInfo = await prismaClient.classSubject.findMany({ where: { classId: payload.classId } });
  const subjectsToRemove = classInfo.filter(
    (subject) => !payload.subjects.map((subject) => subject.toLowerCase()).includes(subject.name.toLowerCase()),
  );

  const subjectsToAdd = payload.subjects
    .filter((subject) => !classInfo.find((s) => s.name.toLowerCase() === subject.toLowerCase()))
    .map((subject) => ({ name: subject, classId: payload.classId }));

  await prismaClient.$transaction(async (client) => {
    if (subjectsToRemove.length) {
      const subjectIds = subjectsToRemove.map((subject) => subject.id);
      await client.classSubject.deleteMany({ where: { id: { in: subjectIds } } });
    }

    if (subjectsToAdd.length) {
      await client.classSubject.createMany({ data: subjectsToAdd });
    }
  });

  return `Subject Assigned successfully`;
};

const getAssignedSubjects = async (classId: string) => {
  const subjects = await prismaClient.classSubject.findMany({ where: { classId }, select: { name: true, id: true } });
  return subjects;
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

const getClassList = async () => {
  const classList = await prismaClient.class.findMany({ select: { level: true, name: true } });
  return classList;
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
  assignSubject,
  getClasses,
  getAssignedSubjects,
  getClassDetails,
  getClassList,
  getClassroomList,
};
