import { comparePassword, encryptPassword } from '../../../helpers';
import { TChangePasswordPayload } from '../validation';
import { prismaClient } from '../../../app/prisma';
import { AppError } from '../../../utils';

export const changePassword = async (
  userId: string,
  payload: TChangePasswordPayload,
) => {
  // finding use from db
  const user = await prismaClient.user.findUniqueOrThrow({
    where: { userId },
    select: { password: true },
  });

  // checking if password match
  const isPasswordMatch = await comparePassword(
    payload.currentPassword,
    user.password,
  );

  if (!isPasswordMatch) throw new AppError('Password does not match', 400);

  // encrypting password
  const password = await encryptPassword(payload.newPassword);

  // updating password
  await prismaClient.user.update({
    where: { userId },
    data: { password, needPasswordChange: false },
  });

  return 'Password Updated';
};
