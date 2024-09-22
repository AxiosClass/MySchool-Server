import * as services from './services';

import { sendSuccessResponse } from '../../helpers';
import { catchAsync } from '../../middlewares';

export const addStudent = catchAsync(async (req, res) => {
  const teacher = await services.addStudent({
    ...req.body,
    admittedByUserId: req.user.userId,
  });

  return sendSuccessResponse(res, {
    message: 'Student added successfully',
    data: teacher,
  });
});
