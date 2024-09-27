import {
  generateRefreshToken,
  generateAccessToken,
  comparePassword,
} from '../../../helpers';

import { prismaClient } from '../../../app/prisma';
import { TLoginPayload } from '../auth.validation';
import { AppError } from '../../../utils';

export const login = async (payload: TLoginPayload) => {
  const { userId, password } = payload;
  const user = await prismaClient.user.findUniqueOrThrow({ where: { userId } });

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) throw new AppError('Password does not match', 400);

  const { name, role } = user;

  const accessToken = generateAccessToken({ userId, name, role });
  const refreshToken = generateRefreshToken({ userId });

  return { accessToken, refreshToken };
};
