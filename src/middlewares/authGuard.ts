import { verifyAccessToken } from '../helpers';
import { prismaClient } from '../app/prisma';
import { catchAsync } from './catchAsync';
import { UserRole } from '@prisma/client';
import { AppError } from '../utils';

const BEARER = 'bearer';

export const authGuard = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req, _, next) => {
    const token = req.headers.authorization;
    if (!token) throw new AppError('No token found', 404);

    const [bearer, authToken] = token.split(' ');
    if (BEARER !== bearer.toLowerCase())
      throw new AppError('Invalid token formate', 400);

    // verifying the token
    const decodedUser = verifyAccessToken(authToken);
    if (!decodedUser) throw new AppError('Invalid token', 400);

    const { userId } = decodedUser;
    const isUserExist = await prismaClient.user.findUnique({
      where: { userId },
      select: { id: true, name: true, userId: true, role: true, status: true },
    });

    if (isUserExist.status !== 'ACTIVE')
      throw new AppError('You are not active user', 400);

    if (!requiredRoles.includes(isUserExist.role))
      throw new AppError('You are not authorized for this service', 400);

    req.user = isUserExist;
    next();
  });
};
