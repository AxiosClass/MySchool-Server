import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { classService } from './class.service';

const addClass = catchAsync(async (req, res) => {
  const classInfo = await classService.addClass(req.body);
  sendSuccessResponse(res, { message: 'Class created successfully', data: classInfo, status: 201 });
});

const addSubjects = catchAsync(async (req, res) => {
  const message = await classService.addSubjects(req.body, req.params.classId);
  sendSuccessResponse(res, { message, data: null, status: 201 });
});

const getClassDetails = catchAsync(async (req, res) => {
  const classDetails = await classService.getClassDetails(req.params.classId);
  sendSuccessResponse(res, { message: 'Class created successfully', data: classDetails });
});

const getClasses = catchAsync(async (req, res) => {
  const classes = await classService.getClasses();
  sendSuccessResponse(res, { message: 'Classes retrieved successfully', data: classes });
});

export const classController = { addClass, addSubjects, getClasses, getClassDetails };
