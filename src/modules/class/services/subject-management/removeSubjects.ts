import { TAddOrRemoveSubjectsPayload } from '../../validation';
import { prismaClient } from '../../../../app/prisma';
import { AppError } from '../../../../utils';

export const removeSubjects = async (
  classId: string,
  payload: TAddOrRemoveSubjectsPayload,
) => {
  const classInfo = await prismaClient.class.findUniqueOrThrow({
    where: { id: classId },
    select: { subjects: true },
  });

  // removing subjects which is in the payload.subjects
  const { subjects } = payload;
  const remainingSubjects = classInfo.subjects.filter(
    (subject) => !subjects.includes(subject),
  );

  if (remainingSubjects.length === classInfo.subjects.length)
    throw new AppError('No class to remove from the class', 400);

  // updating class with remaining subjects
  const updatedClass = await prismaClient.class.update({
    where: { id: classId },
    data: { subjects: { set: remainingSubjects } },
  });

  return updatedClass;
};
