import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { subjectService } from './subjects.service';

const assignSubject = catchAsync(async (req, res) => {
  const message = await subjectService.assignSubject(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const getSubjects = catchAsync(async (req, res) => {
  const subjects = await subjectService.getSubjects(req.query as TObject);
  sendSuccessResponse(res, { message: 'Subjects fetched successfully', data: subjects });
});

export const subjectController = { assignSubject, getSubjects };
