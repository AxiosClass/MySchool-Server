import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { adminService } from './admin.service';

const createAdmin = catchAsync(async (req, res) => {
  const message = await adminService.createAdmin(req.body);
  sendSuccessResponse(res, { message });
});

const getAdmins = catchAsync(async (req, res) => {
  const admins = await adminService.getAdmins(req.query as TObject);
  sendSuccessResponse(res, { message: 'Admins retrieved successfully', data: admins });
});

const deleteAdmin = catchAsync(async (req, res) => {
  const message = await adminService.deleteAdmin(req.params.email);
  sendSuccessResponse(res, { message });
});

const resetPassword = catchAsync(async (req, res) => {
  const message = await adminService.resetPassword(req.params.email);
  sendSuccessResponse(res, { message });
});

export const adminController = { createAdmin, getAdmins, deleteAdmin, resetPassword };
