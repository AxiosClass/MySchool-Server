import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { examService } from './exam.service';
import { TObject } from '../../utils/types';

const addExam = catchAsync(async (req, res) => {
  const message = await examService.addExam(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const getExams = catchAsync(async (req, res) => {
  const { exams, meta } = await examService.getExams(req.query as TObject);
  sendSuccessResponse(res, { message: 'Exams fetched successfully', meta, data: exams });
});

const updateExam = catchAsync(async (req, res) => {
  const message = await examService.updateExam(req.params.examId, req.body);
  sendSuccessResponse(res, { message, data: null });
});

export const examController = { addExam, getExams, updateExam };
