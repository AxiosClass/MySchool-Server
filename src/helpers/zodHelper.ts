import { isValidDate } from './common';
import { z } from 'zod';

export const enumGenerator = (options: string[], message: string) => {
  return z.enum([...(options as [string, ...string[]])], { message });
};

export const dateGenerator = (required_error: string) => {
  return z
    .string({ required_error })
    .refine((date) => isValidDate(date), { message: 'Invalid date' });
};
