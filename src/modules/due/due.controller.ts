import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { dueService } from './due.service';

const getDueByClassroom = catchAsync(async (_, res) => {
  const result = await dueService.getDueByClassroom();
  sendSuccessResponse(res, { message: 'Dues by classroom fetched successfully', data: result });
});

const getDuesByStudent = catchAsync(async (req, res) => {
  const { meta, student } = await dueService.getDueByStudent(req.query as TObject);
  sendSuccessResponse(res, { message: 'Dues by student fetched successfully', meta, data: student });
});

export const dueController = { getDueByClassroom, getDuesByStudent };
