import { TAddOrRemoveSubjectsPayload } from '../../validation';
import { prismaClient } from '../../../../app/prisma';

export const addSubjects = async (
  classId: string,
  payload: TAddOrRemoveSubjectsPayload,
) => {
  const subjects = payload.subjects.map((subject) => ({
    name: subject,
    classId,
  }));
  const newSubjects = await prismaClient.subjectClass.createMany({
    data: subjects,
  });

  return `Added ${newSubjects.count} subjects`;
};
