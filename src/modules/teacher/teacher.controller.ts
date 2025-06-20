import { catchAsync } from '../../middlewares/catchAsync';
import { sendSuccessResponse } from '../../helpers/responseHelper';
import { teacherService } from './teacher.service';
import { TObject } from '../../utils/types';

const addTeacher = catchAsync(async (req, res) => {
  const message = await teacherService.addTeacher(req.body);
  sendSuccessResponse(res, { status: 201, message });
});

const getTeachers = catchAsync(async (req, res) => {
  const { meta, teachers } = await teacherService.getTeachers(req.query as TObject);
  sendSuccessResponse(res, { message: 'Teachers retrieved successfully', meta, data: teachers });
});

const getTeacherList = catchAsync(async (req, res) => {
  const teachers = await teacherService.getTeacherList();
  sendSuccessResponse(res, { message: 'Teacher list retrieved successfully', data: teachers });
});

export const teacherController = { addTeacher, getTeachers, getTeacherList };
