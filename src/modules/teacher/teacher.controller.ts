import { catchAsync } from '../../middlewares/catchAsync';
import { sendSuccessResponse } from '../../helpers/responseHelper';
import { teacherService } from './teacher.service';

const addTeacher = catchAsync(async (req, res) => {
  const { password } = await teacherService.addTeacher(req.body);
  sendSuccessResponse(res, { status: 201, message: 'Added teacher successfully', data: { password } });
});

const getTeachers = catchAsync(async (_, res) => {
  const teachers = await teacherService.getTeachers();
  sendSuccessResponse(res, { message: 'Teachers retrieved successfully', data: teachers });
});

export const teacherController = { addTeacher, getTeachers };
