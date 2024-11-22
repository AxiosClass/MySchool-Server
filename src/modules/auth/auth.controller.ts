import { authService } from './auth.service';
import { catchAsync } from '../../middlewares/catchAsync';
import { sendSuccessResponse } from '../../helpers/responseHelper';

const login = catchAsync(async (req, res) => {
  const loginType = req.query.type as string;
  const { accessToken } = await authService.login(req.body, loginType);

  sendSuccessResponse(res, {
    message: 'Login was successful',
    data: { accessToken },
  });
});

export const authController = { login };
