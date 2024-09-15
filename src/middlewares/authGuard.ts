import { AppError } from '../utils';
import { catchAsync } from './catchAsync';
import { User } from '../modules/user/model';
import { TRole } from '../modules/user/interface';

const BEARER = 'bearer';

export const authGuard = (...requiredRoles: TRole[]) => {
  return catchAsync(async (req, _, next) => {
    const token = req.headers.authorization;
    if (!token) throw new AppError('No token found', 404);

    const [bearer, authToken] = token.split(' ');
    if (BEARER !== bearer.toLowerCase())
      throw new AppError('Invalid token formate', 400);

    // verifying the token
    const decodedUser = User.verifyAccessToken(authToken);
    if (!decodedUser) throw new AppError('Invalid token', 400);

    const { _id } = decodedUser;
    const isUserExist = await User.findOne(
      { _id },
      { _id: 1, userId: 1, role: 1 },
    );

    if (!isUserExist)
      throw new AppError('You are not authorized for this service', 400);

    if (isUserExist.status === 'BLOCKED')
      throw new AppError('You are blocked', 400);

    const { role } = isUserExist;

    if (!requiredRoles.includes(role))
      throw new AppError('You are not authorized', 400);

    req.user = isUserExist;
    next();
  });
};
