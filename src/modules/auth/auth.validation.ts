import { z } from 'zod';
import { USER_ROLES } from '../../utils/types';

export const loginSchema = z.object({
  id: z.string().min(1, { message: 'UserId is required' }),
  password: z.string().min(4, { message: 'Minimum length is 4' }),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string().min(1, { message: 'New password is required' }),
});

export const resetPasswordSchema = z.object({
  userId: z.string().trim().min(1, { message: 'User ID can not be empty' }),
  userRole: z.nativeEnum(USER_ROLES, { message: 'Invalid user role' }),
});

type TLoginPayload = z.infer<typeof loginSchema>;
type TChangePasswordPayload = z.infer<typeof changePasswordSchema>;
type TResetPasswordPayload = z.infer<typeof resetPasswordSchema>;

export const authValidation = { loginSchema, changePasswordSchema, resetPasswordSchema };
export { TLoginPayload, TChangePasswordPayload, TResetPasswordPayload };
