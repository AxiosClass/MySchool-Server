import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { termResultService } from './term-result.service';

const getStudentsWithTermResult = catchAsync(async (req, res) => {
  const result = await termResultService.getStudentsWithTermResult(req.query as TObject);

  sendSuccessResponse(res, {
    message: 'Students with term results fetched successfully',
    data: result,
  });
});

export const termResultController = { getStudentsWithTermResult };
