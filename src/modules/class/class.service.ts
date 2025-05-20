import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import type { TAddClassPayload, TAssignClassSubjectsPayload } from './class.validation';

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

const getAssignedClassSubjects = async (classId: string) => {
  const subjects = await prismaClient.classSubject.findMany({
    where: { classId },
    select: { subject: { select: { id: true, name: true, description: true } } },
  });

  return subjects.map((eachSubject) => eachSubject.subject);
};

const updateAssignedSubjectList = async (payload: TAssignClassSubjectsPayload) => {
  const { subjectIds, classId } = payload;

  const assignedSubjects = await prismaClient.classSubject.findMany({
    where: { classId },
    select: { subjectId: true },
  });

  const assignedSubjectIds = assignedSubjects.map((subject) => subject.subjectId);

  const newSet = new Set(subjectIds);
  const oldSet = new Set(assignedSubjectIds);

  const subjectIdsToAdd = subjectIds.filter((id) => !oldSet.has(id));
  const subjectIdsToRemove = assignedSubjectIds.filter((id) => !newSet.has(id));

  // assign subjects
  if (subjectIdsToAdd.length > 0) {
    await prismaClient.classSubject.createMany({
      data: subjectIdsToAdd.map((subjectId) => ({
        classId,
        subjectId,
      })),
      skipDuplicates: true, // Prevent error if some already exist
    });
  }

  // Remove unassigned subjects
  if (subjectIdsToRemove.length > 0) {
    await prismaClient.classSubject.deleteMany({
      where: {
        classId,
        subjectId: { in: subjectIdsToRemove },
      },
    });
  }

  return 'Assigned subject list updated!';
};

export const classService = {
  addClass,
  getClasses,
  getClassDetails,
  getClassList,
  getClassroomList,
  getAssignedClassSubjects,
  updateAssignedSubjectList,
};
