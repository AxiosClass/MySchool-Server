import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { actionsService } from './actions.service';

const addMonthlyDues = catchAsync(async (req, res) => {
  const message = await actionsService.addMonthlyDues(req.query as TObject);
  sendSuccessResponse(res, { message });
});

export const actionsController = { addMonthlyDues };
