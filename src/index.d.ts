import { UserRole, UserStatus } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: {
        status: UserStatus;
        userId: string;
        name: string;
        role: UserRole;
      };
    }
  }
}
