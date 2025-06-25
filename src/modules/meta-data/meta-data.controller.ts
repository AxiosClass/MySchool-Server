import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { metaDataService } from './meta-data.service';

const getOverview = catchAsync(async (req, res) => {
  const result = await metaDataService.getOverview();
  sendSuccessResponse(res, { message: 'Overview fetched successfully', data: result });
});

const getAttendanceTrends = catchAsync(async (req, res) => {
  const attendanceTrends = await metaDataService.getAttendanceTrends(Number(req.query.range) || 7);
  sendSuccessResponse(res, { message: 'Attendance trends fetched successfully', data: attendanceTrends });
});

const generatePaymentTrends = catchAsync(async (req, res) => {
  const paymentTrends = await metaDataService.getPaymentTrends();
  sendSuccessResponse(res, { message: 'Payment trends fetched successfully', data: paymentTrends });
});

export const metaDataController = { getOverview, getAttendanceTrends, generatePaymentTrends };
