import { DayOfWeek } from '@prisma/client';
import { z } from 'zod';

const addOrUpdateWeekendSchema = z.object({
  days: z.nativeEnum(DayOfWeek).array().min(1, { message: 'Add minimum a day' }),
});

type TAddOrUpdateWeekendPayload = z.infer<typeof addOrUpdateWeekendSchema>;

export const holidayValidation = { addOrUpdateWeekendSchema };
export { TAddOrUpdateWeekendPayload };
