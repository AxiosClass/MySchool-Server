import { prismaClient } from '../../../app/prisma';
import { TAddClassPayload } from '../class.validation';

export const addClass = async (payload: TAddClassPayload) => {
  const { name, level } = payload;

  const newClass = await prismaClient.class.create({
    data: { name, level },
  });

  return newClass;
};
