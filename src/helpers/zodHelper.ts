import { z } from 'zod';

export const enumGenerator = (options: string[], message: string) => {
  return z.enum([...(options as [string, ...string[]])], { message });
};
