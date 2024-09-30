import * as services from './services';

import { sendSuccessResponse } from '../../helpers';
import { catchAsync } from '../../middlewares';

export const addTeacher = catchAsync(async (req, res) => {
  const teacher = await services.addTeacher(req.body);

  return sendSuccessResponse(res, {
    message: 'Teacher added successfully',
    data: teacher,
  });
});
