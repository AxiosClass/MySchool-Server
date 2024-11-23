import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { classroomService } from './classroom.service';

const createClassroom = catchAsync(async (req, res) => {
  const message = await classroomService.createClassroom(req.body);

  sendSuccessResponse(res, { status: 201, message, data: null });
});

export const classroomController = { createClassroom };
