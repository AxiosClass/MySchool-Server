import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { noticeService } from './notice.service';

const createNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.createNotice(req.body);
  sendSuccessResponse(res, { message: 'Notice created successfully', data: notice });
});

const getNotices = catchAsync(async (req, res) => {
  const { meta, notices } = await noticeService.getNotices(req.query);
  sendSuccessResponse(res, { message: 'Notices retrieved successfully', meta, data: notices });
});

export const noticeController = { createNotice, getNotices };
