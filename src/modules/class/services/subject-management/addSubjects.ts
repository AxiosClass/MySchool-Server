import { TAddOrRemoveSubjectsPayload } from '../../validation';
import { prismaClient } from '../../../../app/prisma';

export const addSubjects = async (
  classId: string,
  payload: TAddOrRemoveSubjectsPayload,
) => {
  const updatedClass = await prismaClient.class.update({
    where: { id: classId },
    data: {
      subjects: { push: payload.subjects },
    },
  });

  return updatedClass;
};
