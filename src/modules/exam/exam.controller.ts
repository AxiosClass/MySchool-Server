import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { examService } from './exam.service';

const addExam = catchAsync(async (req, res) => {
  const message = await examService.addExam(req.body);
  sendSuccessResponse(res, { message, data: null });
});

export const examController = { addExam };
