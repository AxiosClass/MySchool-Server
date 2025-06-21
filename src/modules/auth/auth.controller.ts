import { authService } from './auth.service';
import { catchAsync } from '../../middlewares/catchAsync';
import { sendSuccessResponse } from '../../helpers/responseHelper';

const login = catchAsync(async (req, res) => {
  const loginType = req.query.type as string;
  const { accessToken } = await authService.login(req.body, loginType);
  sendSuccessResponse(res, { message: 'Login was successful', data: { accessToken } });
});

const changePassword = catchAsync(async (req, res) => {
  const message = await authService.changePassword(req.body, req.user.id, req.user.role);
  sendSuccessResponse(res, { message });
});

const resetPassword = catchAsync(async (req, res) => {
  const message = await authService.resetPassword(req.body);
  sendSuccessResponse(res, { message });
});

export const authController = { login, changePassword, resetPassword };
