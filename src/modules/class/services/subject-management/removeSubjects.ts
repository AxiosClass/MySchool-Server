import { TAddOrRemoveSubjectsPayload } from '../../class.validation';
import { prismaClient } from '../../../../app/prisma';
import { AppError } from '../../../../utils';

export const removeSubjects = async (
  classId: string,
  payload: TAddOrRemoveSubjectsPayload,
) => {
  const deletedStatus = await prismaClient.subjectClass.deleteMany({
    where: { name: { in: payload.subjects }, classId },
  });

  return `Deleted ${deletedStatus.count} subjects`;
};
