import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { USER_ROLES } from '../../utils/types';
import { noticeService } from './notice.service';

const createNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.createNotice(req.body);
  sendSuccessResponse(res, { message: 'Notice created successfully', data: notice });
});

const getNotices = catchAsync(async (req, res) => {
  const { meta, notices } = await noticeService.getNotices(req.query);
  sendSuccessResponse(res, { message: 'Notices retrieved successfully', meta, data: notices });
});

const getMyNotices = catchAsync(async (req, res) => {
  const role = req.user.role;
  const roleValue = role === USER_ROLES.TEACHER ? 'TEACHER' : role === USER_ROLES.STUDENT ? 'STUDENT' : null;

  const notices = await noticeService.getMyNotices(roleValue);
  sendSuccessResponse(res, { message: 'Notices Fetched successfully', data: notices });
});

const updateNotice = catchAsync(async (req, res) => {
  const notice = await noticeService.updateNotice(req.body, req.params.noticeId);
  sendSuccessResponse(res, { message: 'Notice updated successfully', data: notice });
});

const deleteNotice = catchAsync(async (req, res) => {
  const message = await noticeService.deleteNotice(req.params.noticeId);
  sendSuccessResponse(res, { message });
});

export const noticeController = { createNotice, getNotices, getMyNotices, updateNotice, deleteNotice };
