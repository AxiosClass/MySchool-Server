import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { dueService } from './due.service';

const getDueByClassroom = catchAsync(async (_, res) => {
  const result = await dueService.getDueByClassroom();
  sendSuccessResponse(res, { message: 'Dues by classroom fetched successfully', data: result });
});

export const dueController = { getDueByClassroom };
