import { z } from 'zod';

// validation schemas
export const login = z.object({
  userId: z.string().min(1, { message: 'UserId is required' }),
  password: z.string().min(4, { message: 'Minimum length is 4' }),
});

export const changePassword = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(1, { message: 'New password is required' }),
});

// types
export type TLoginPayload = z.infer<typeof login>;
export type TChangePasswordPayload = z.infer<typeof changePassword>;
