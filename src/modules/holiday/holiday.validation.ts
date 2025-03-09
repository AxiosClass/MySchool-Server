import { z } from 'zod';

const addHolidaySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  startDate: z
    .string()
    .date()
    .transform((val) => new Date(val)),
  endDate: z
    .string()
    .date()
    .transform((val) => new Date(val)),
});

type TAddHolidayPayload = z.infer<typeof addHolidaySchema>;

export const holidayValidation = { addHolidaySchema };
export { TAddHolidayPayload };
