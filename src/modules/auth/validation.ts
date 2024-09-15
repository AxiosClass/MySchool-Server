import { z } from 'zod';

// validation schemas
export const loginValidationSchema = z.object({
  userId: z.string().min(1, { message: 'UserId is required' }),
  password: z.string().min(4, { message: 'Minimum length is 4' }),
});

export const changePasswordValidationSchema = z.object({
  currentPassword: z
    .string()
    .min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(1, { message: 'New password is required' }),
});

// types
export interface ILoginPayload extends z.infer<typeof loginValidationSchema> {}
export interface IChangePasswordPayload
  extends z.infer<typeof changePasswordValidationSchema> {}
