import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { metaDataService } from './meta-data.service';

const getAttendanceSummary = catchAsync(async (req, res) => {
  const summary = await metaDataService.getAttendanceSummary();
  sendSuccessResponse(res, { message: 'Attendance summary fetched successfully', data: summary });
});

export const metaDataController = { getAttendanceSummary };
