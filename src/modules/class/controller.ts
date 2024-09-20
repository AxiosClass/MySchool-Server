import * as services from './services';

import { catchAsync } from '../../middlewares';
import { sendSuccessResponse } from '../../helpers';

export const addClass = catchAsync(async (req, res) => {
  const newClass = await services.addClass(req.body);

  return sendSuccessResponse(res, { message: 'Class Added!', data: newClass });
});
