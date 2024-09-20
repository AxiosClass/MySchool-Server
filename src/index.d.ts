import { UserRole, UserStatus } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user: {
        status: UserStatus;
        id: string;
        userId: string;
        name: string;
        role: UserRole;
      };
    }
  }
}
