import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { classService } from './class.service';

const addClass = catchAsync(async (req, res) => {
  const classInfo = await classService.addClass(req.body);

  sendSuccessResponse(res, {
    message: 'Class created successfully',
    data: classInfo,
    status: 201,
  });
});

export const classController = { addClass };
