import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { termService } from './term.service';

const addTerms = catchAsync(async (req, res) => {
  const message = await termService.addTerm(req.body);
  sendSuccessResponse(res, { message });
});

export const termController = { addTerms };
