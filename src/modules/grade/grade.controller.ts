import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { gradeService } from './grade.service';

const addOrUpdateGrade = catchAsync(async (req, res) => {
  const message = await gradeService.addOrUpdateGrade(req.body, req.user.id);
  sendSuccessResponse(res, { message });
});

export const gradeController = { addOrUpdateGrade };
