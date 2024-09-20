import {
  generateRefreshToken,
  generateAccessToken,
  comparePassword,
} from '../../../helpers';

import { prismaClient } from '../../../app/prisma';
import { TLoginPayload } from '../validation';
import { AppError } from '../../../utils';

export const login = async (payload: TLoginPayload) => {
  const { userId, password } = payload;
  const user = await prismaClient.user.findUniqueOrThrow({ where: { userId } });

  const isPasswordMatch = await comparePassword(password, user.password);
  if (!isPasswordMatch) throw new AppError('Password does not match', 400);

  const { id, name, role } = user;

  const accessToken = generateAccessToken({ id, userId, name, role });
  const refreshToken = generateRefreshToken({ id, userId });

  return { accessToken, refreshToken };
};
