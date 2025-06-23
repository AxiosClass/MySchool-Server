import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { dueService } from './due.service';

const getDueByClass = catchAsync(async (_, res) => {
  const result = await dueService.getDuesByClass();
  sendSuccessResponse(res, { message: 'Dues by class fetched successfully', data: result });
});

const getDueByClassroom = catchAsync(async (req, res) => {
  const result = await dueService.getDueByClassroom(req.params.level);
  sendSuccessResponse(res, { message: 'Dues by classroom fetched successfully', data: result });
});

const getDuesByStudent = catchAsync(async (req, res) => {
  const result = await dueService.getDueByStudent(req.params.classroomId);
  sendSuccessResponse(res, { message: 'Dues by student fetched successfully', data: result });
});

export const dueController = { getDueByClass, getDueByClassroom, getDuesByStudent };
