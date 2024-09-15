import { Schema } from 'mongoose';
import { User } from '../../user/model';
import { AppError } from '../../../utils';
import { IChangePasswordPayload } from '../validation';

export const changePassword = async (
  userId: string,
  payload: IChangePasswordPayload,
) => {
  const user = await User.findOne({ userId });

  const isPasswordMatch = await user.comparePassword(payload.currentPassword);
  if (!isPasswordMatch) throw new AppError("Password doesn't match", 400);

  user.password = payload.newPassword;
  await user.save();

  return 'Password Updated';
};
