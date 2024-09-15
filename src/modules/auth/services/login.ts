import { User } from '../../user/model';
import { AppError } from '../../../utils';
import { ILoginPayload } from '../validation';

export const login = async (payload: ILoginPayload) => {
  const { userId, password } = payload;
  const isUserExist = await User.findOne({ userId });

  if (!isUserExist) throw new AppError('User not found', 404);

  const isPasswordMatch = await isUserExist.comparePassword(password);
  if (!isPasswordMatch) throw new AppError('Password does not match', 400);

  const accessToken = isUserExist.generateAccessToken();
  const refreshToken = isUserExist.generateRefreshToken();
  return { accessToken, refreshToken };
};
