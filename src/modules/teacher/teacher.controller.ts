import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { teacherService } from './teacher.service';

const addTeacher = catchAsync(async (req, res) => {
  const teacher = await teacherService.addTeacher(req.body);

  sendSuccessResponse(res, {
    status: 201,
    message: 'Added teacher successfully',
    data: teacher,
  });
});

export const teacherController = { addTeacher };
