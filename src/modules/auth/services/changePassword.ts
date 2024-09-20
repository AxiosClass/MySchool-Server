import { AppError } from '../../../utils';
import { TChangePasswordPayload } from '../validation';

export const changePassword = async (
  userId: string,
  payload: TChangePasswordPayload,
) => {
  // const user = await User.findOne({ userId });

  // const isPasswordMatch = await user.comparePassword(payload.currentPassword);
  // if (!isPasswordMatch) throw new AppError("Password doesn't match", 400);

  // user.password = payload.newPassword;
  // await user.save();

  return 'Password Updated';
};
