import { prismaClient } from '../../app/prisma';
import { TAddOrUpdateWeekendPayload } from './holiday.validation';

const addOrUpdateWeekends = async (payload: TAddOrUpdateWeekendPayload) => {
  const weekendDays = await prismaClient.weekendDay.findMany();

  const weekendDaysToAdd = payload.days
    .filter((day) => !weekendDays.find((d) => d.day === day))
    .map((day) => ({ day }));

  const weekendDaysToRemove = weekendDays.filter((each) => !payload.days.includes(each.day));

  console.log(weekendDaysToRemove, weekendDaysToAdd);

  await prismaClient.$transaction(async (client) => {
    if (weekendDaysToRemove.length) {
      const toRemoveDays = weekendDaysToRemove.map((each) => each.day);
      await client.weekendDay.deleteMany({ where: { day: { in: toRemoveDays } } });
    }

    if (weekendDaysToAdd.length) {
      await client.weekendDay.createMany({ data: weekendDaysToAdd });
    }
  });

  return 'Weekend Modified Successfully';
};

const getWeekends = async () => {
  return prismaClient.weekendDay.findMany();
};

export const holidayService = { addOrUpdateWeekends, getWeekends };
