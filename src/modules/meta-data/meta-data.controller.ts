import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { metaDataService } from './meta-data.service';

const getAttendanceSummary = catchAsync(async (_, res) => {
  const summary = await metaDataService.getAttendanceSummary();
  sendSuccessResponse(res, { message: 'Attendance summary fetched successfully', data: summary });
});

const getAttendanceTrends = catchAsync(async (req, res) => {
  const attendanceTrends = await metaDataService.getAttendanceTrends(Number(req.query.range) || 7);
  sendSuccessResponse(res, { message: 'Attendance trends fetched successfully', data: attendanceTrends });
});

export const metaDataController = { getAttendanceSummary, getAttendanceTrends };
