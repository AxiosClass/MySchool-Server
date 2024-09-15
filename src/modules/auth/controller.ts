import * as services from './services';

import { catchAsync } from '../../middlewares';
import { sendSuccessResponse } from '../../helpers';

export const login = catchAsync(async (req, res) => {
  const { accessToken, refreshToken } = await services.login(req.body);

  return sendSuccessResponse(res, {
    message: 'Successfully login',
    data: { accessToken, refreshToken },
  });
});

export const changePassword = catchAsync(async (req, res) => {
  const message = await services.changePassword(req.user.userId, req.body);

  return sendSuccessResponse(res, { message, data: null });
});
