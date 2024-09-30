import * as services from './services';

import { sendSuccessResponse } from '../../helpers';
import { catchAsync } from '../../middlewares';

export const addStudent = catchAsync(async (req, res) => {
  const student = await services.addStudent(req.user.userId, req.body);

  return sendSuccessResponse(res, {
    message: 'Student added successfully',
    data: student,
  });
});
