import { SalaryType } from '@prisma/client';
import { prismaClient } from '../../../app/prisma';
import { TGiveSalaryPayload } from '../transaction.validation';

export const giveSalary = async (payload: TGiveSalaryPayload) => {
  const { amount, date, staffId, type } = payload;
  const result = await prismaClient.salary.create({
    data: { amount, date, staffId, type: type as SalaryType },
  });

  return result;
};
