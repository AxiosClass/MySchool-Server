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

const updateNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.updateNotice(req.body, req.params.noticeId);
  sendSuccessResponse(res, { message: 'Notice updated successfully', data: notice });
});

export const noticeController = { createNotice, getNotices, updateNotice };
