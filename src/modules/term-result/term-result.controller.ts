import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { termResultService } from './term-result.service';

const addTermResult = catchAsync(async (req, res) => {
  const message = await termResultService.addTermResult(req.body, req.user.id);
  sendSuccessResponse(res, { message });
});

const getStudentsWithTermResult = catchAsync(async (req, res) => {
  const result = await termResultService.getStudentsWithTermResult(req.query as TObject);

  sendSuccessResponse(res, {
    message: 'Students with term results fetched successfully',
    data: result,
  });
});

const generateStudentGrade = catchAsync(async (req, res) => {
  const result = await termResultService.generateStudentGrade(req.params.studentId, req.query as TObject);
  sendSuccessResponse(res, { message: 'Grade generated successfully', data: result });
});

export const termResultController = { addTermResult, getStudentsWithTermResult, generateStudentGrade };
