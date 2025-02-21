import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { classService } from './class.service';

const addClass = catchAsync(async (req, res) => {
  const classInfo = await classService.addClass(req.body);
  sendSuccessResponse(res, { message: 'Class created successfully', data: classInfo, status: 201 });
});

const assignSubject = catchAsync(async (req, res) => {
  const message = await classService.assignSubject(req.body);
  sendSuccessResponse(res, { message, data: null, status: 201 });
});

const getAssignedSubjects = catchAsync(async (req, res) => {
  const subjects = await classService.getAssignedSubjects(req.params.classId);
  sendSuccessResponse(res, { message: 'Subjects retrieved successfully', data: subjects });
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

export const classController = {
  addClass,
  assignSubject,
  getClasses,
  getClassDetails,
  getClassList,
  getClassroomList,
  getAssignedSubjects,
};
