import { z } from 'zod';

export const addClass = z.object({
  name: z
    .string({ required_error: 'Class Name is required' })
    .min(1, { message: 'Class Name is required' }),
  level: z
    .string({ required_error: 'Level is required' })
    .min(1, { message: 'Level is required' }),
});

export type TAddClassPayload = z.infer<typeof addClass>;
