import { prismaClient } from '../../app/prisma';
import { TObject } from '../../utils/types';
import { TAssignSubjectsPayload } from './subject.validation';

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

const getSubjects = (query: TObject) => {
  const classId = query.classId;
  const classroomId = query.classroomId;

  return prismaClient.classSubject.findMany({
    where: {
      ...(classId && { classId }),
      ...(classroomId && { class: { classrooms: { every: { id: classroomId } } } }),
    },
    select: { id: true, name: true, classId: true },
  });
};

export const subjectService = { assignSubject, getSubjects };
