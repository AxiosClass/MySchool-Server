import { prismaClient } from '../app/prisma';
import { verifyAccessToken } from '../helpers/tokenHelper';

import { USER_ROLES } from '../utils/types';
import { catchAsync } from './catchAsync';
import { UserStatus } from '@prisma/client';
import { AppError } from '../utils/appError';

const BEARER = 'bearer';

const ADMIN_ROLES = [USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT, USER_ROLES.SUPER_ADMIN];

export const authGuard = (...requiredRoles: USER_ROLES[]) => {
  return catchAsync(async (req, _, next) => {
    const token = req.headers.authorization;
    if (!token) throw new AppError('No token found', 404);

    const [bearer, authToken] = token.split(' ');
    if (BEARER !== bearer.toLowerCase()) throw new AppError('Invalid token formate', 400);

    // verifying the token
    const decodedUser = verifyAccessToken(authToken);
    if (!decodedUser) throw new AppError('Invalid token', 400);

    const { id, role } = decodedUser;
    const isAdmin = ADMIN_ROLES.includes(role);

    if (isAdmin) {
      const adminInfo = await prismaClient.admin.findFirstOrThrow({
        where: { id },
        select: { name: true, role: true, status: true, needPasswordChange: true },
      });

      if (adminInfo.status === UserStatus.BLOCKED)
        throw new AppError('You are blocked, please contact to the admin', 400);

      if (!requiredRoles.includes(adminInfo.role as USER_ROLES)) throw new AppError('Un authorized access', 401);

      const { name, role, needPasswordChange } = adminInfo;
      req.user = { id, name, role: role as USER_ROLES, needPasswordChange };
    }

    next();
  });
};
