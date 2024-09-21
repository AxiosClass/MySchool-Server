import * as services from './services';

import { sendSuccessResponse } from '../../helpers';
import { catchAsync } from '../../middlewares';

export const addClass = catchAsync(async (req, res) => {
  const newClass = await services.addClass(req.body);

  return sendSuccessResponse(res, { message: 'Class Added!', data: newClass });
});

export const addSubjects = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const message = await services.addSubjects(classId, req.body);

  return sendSuccessResponse(res, { message, data: null });
});

export const removeSubjects = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const message = await services.removeSubjects(classId, req.body);

  return sendSuccessResponse(res, { message, data: null });
});

export const addSection = catchAsync(async (req, res) => {
  const { classId } = req.params;
  const section = await services.addSection(classId, req.body);

  return sendSuccessResponse(res, {
    message: 'Section Added successfully',
    data: section,
  });
});
