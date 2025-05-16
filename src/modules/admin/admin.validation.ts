import { AdminRole } from '@prisma/client';
import { z } from 'zod';

const createAdminSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1, 'Name is required'),
  role: z.nativeEnum(AdminRole, { message: 'Invalid role' }),
});

type TCreateAdminPayload = z.infer<typeof createAdminSchema>;

export const adminValidation = { createAdminSchema };
export { TCreateAdminPayload };
