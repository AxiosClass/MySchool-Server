import * as services from './services';

import { catchAsync } from '../../middlewares';
import { sendSuccessResponse } from '../../helpers';

export const addClass = catchAsync(async (req, res) => {
  const newClass = await services.addClass(req.body);

  return sendSuccessResponse(res, { message: 'Class Added!', data: newClass });
});

export const addSubjects = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const updatedClass = await services.addSubjects(classId, req.body);

  return sendSuccessResponse(res, {
    message: 'Subjects added successfully',
    data: updatedClass,
  });
});

export const removeSubjects = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const updatedClass = await services.removeSubjects(classId, req.body);

  return sendSuccessResponse(res, {
    message: 'Subjects Removed successfully',
    data: updatedClass,
  });
});
