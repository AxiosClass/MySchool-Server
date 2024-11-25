import { TAddClassPayload, TAddOrRemoveSubjectsPayload } from './class.validation';

import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';

const addClass = async (payload: TAddClassPayload) => {
  // checking if the class exist or not
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
      subjects: { select: { id: true, name: true } },
      classrooms: { select: { id: true, students: { select: { id: true } } } },
    },
  });

  return classes;
};

const addSubjects = async (payload: TAddOrRemoveSubjectsPayload, classId: string) => {
  const subjects = payload.subjects.map((subject) => ({ name: subject, classId }));
  const subjectInfo = await prismaClient.classSubject.createMany({
    data: subjects,
  });

  if (subjectInfo.count < 1) throw new AppError('Failed to create Subjects', 400);

  return 'Subjects Created Successfully';
};

export const classService = { addClass, addSubjects, getClasses };
