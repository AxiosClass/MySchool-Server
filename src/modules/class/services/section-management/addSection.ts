import { prismaClient } from '../../../../app/prisma';
import { TAddSectionPayload } from '../../class.validation';

export const addSection = async (
  classId: string,
  payload: TAddSectionPayload,
) => {
  const { name, teacherId } = payload;

  const section = await prismaClient.section.create({
    data: { name, teacherId, classId },
  });

  return section;
};
