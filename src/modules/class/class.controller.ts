import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { classService } from './class.service';

const addClass = catchAsync(async (req, res) => {
  const classInfo = await classService.addClass(req.body);
  sendSuccessResponse(res, { message: 'Class created successfully', data: classInfo, status: 201 });
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

const updateClass = catchAsync(async (req, res) => {
  const message = await classService.updateClass(req.body, req.params.classId);
  sendSuccessResponse(res, { message });
});

const getClassroomList = catchAsync(async (req, res) => {
  const classroomList = await classService.getClassroomList(req.params.level);
  sendSuccessResponse(res, { message: 'Classroom list retrieved successfully', data: classroomList });
});

const getAssignedClassSubject = catchAsync(async (req, res) => {
  const subjects = await classService.getAssignedClassSubjects(req.params.classId);
  sendSuccessResponse(res, { message: 'Subjects retrieved successfully', data: subjects });
});

const updateAssignedSubjectList = catchAsync(async (req, res) => {
  const message = await classService.updateAssignedSubjectList(req.body);
  sendSuccessResponse(res, { message });
});

const deleteClass = catchAsync(async (req, res) => {
  const message = await classService.deleteClass(req.params.classId);
  sendSuccessResponse(res, { message });
});

export const classController = {
  addClass,
  getClasses,
  getClassDetails,
  getClassList,
  updateClass,
  getClassroomList,
  getAssignedClassSubject,
  updateAssignedSubjectList,
  deleteClass,
};
