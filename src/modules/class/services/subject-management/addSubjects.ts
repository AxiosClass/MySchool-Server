import { prismaClient } from '../../../../app/prisma';
import { TAddSubjectsPayload } from '../../validation';

export const addSubjects = async (
  classId: string,
  payload: TAddSubjectsPayload,
) => {
  const updatedClass = await prismaClient.class.update({
    where: { id: classId },
    data: {
      subjects: { push: payload.subjects },
    },
  });

  return updatedClass;
};
