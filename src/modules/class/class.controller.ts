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
  sendSuccessResponse(res, { message: 'Class retrieved successfully', data: classDetails });
});

const getClasses = catchAsync(async (req, res) => {
  const classes = await classService.getClasses();
  sendSuccessResponse(res, { message: 'Classes retrieved successfully', data: classes });
});

const getClassList = catchAsync(async (req, res) => {
  const classList = await classService.getClassList();
  sendSuccessResponse(res, { message: 'Class list retrieved successfully', data: classList });
});

const getClassroomList = catchAsync(async (req, res) => {
  const classroomList = await classService.getClassroomList(req.params.level);
  sendSuccessResponse(res, { message: 'Classroom list retrieved successfully', data: classroomList });
});

export const classController = { addClass, addSubjects, getClasses, getClassDetails, getClassList, getClassroomList };
