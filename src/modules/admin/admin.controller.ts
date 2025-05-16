import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { adminService } from './admin.service';

const createAdmin = catchAsync(async (req, res) => {
  const message = await adminService.createAdmin(req.body);
  sendSuccessResponse(res, { message, data: null });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const message = await adminService.deleteAdmin(req.params.email);
  sendSuccessResponse(res, { message, data: null });
});

export const adminController = { createAdmin, deleteAdmin };
