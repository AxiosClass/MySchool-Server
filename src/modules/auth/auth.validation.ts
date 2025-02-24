import { z } from 'zod';

export const loginSchema = z.object({
  id: z.string().min(1, { message: 'UserId is required' }),
  password: z.string().min(4, { message: 'Minimum length is 4' }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(1, { message: 'New password is required' }),
});

type TLoginPayload = z.infer<typeof loginSchema>;
type TChangePasswordPayload = z.infer<typeof changePasswordSchema>;

export const authValidation = { loginSchema };
export { TLoginPayload, TChangePasswordPayload };
