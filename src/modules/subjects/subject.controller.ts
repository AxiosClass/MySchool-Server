import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { subjectService } from './subjects.service';

const createSubject = catchAsync(async (req, res) => {
  const message = await subjectService.createSubject(req.body);
  sendSuccessResponse(res, { message });
});

export const subjectController = { createSubject };
