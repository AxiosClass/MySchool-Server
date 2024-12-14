import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { noticeService } from './notice.service';

const createNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.createNotice(req.body);
  sendSuccessResponse(res, { message: 'Notice created successfully', data: notice });
});

export const noticeController = { createNotice };
