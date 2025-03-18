import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { classroomService } from './classroom.service';

const createClassroom = catchAsync(async (req, res) => {
  const message = await classroomService.createClassroom(req.body);
  sendSuccessResponse(res, { status: 201, message, data: null });
});

const assignSubjectTeacher = catchAsync(async (req, res) => {
  const message = await classroomService.assignSubjectTeacher(req.body);
  sendSuccessResponse(res, { status: 201, message, data: null });
});

const removeSubjectTeacher = catchAsync(async (req, res) => {
  const message = await classroomService.removeSubjectTeacher(req.params.classroomSubjectTeacherId);
  sendSuccessResponse(res, { message, data: null });
});

const getSubjectListWithTeacher = catchAsync(async (req, res) => {
  const subjects = await classroomService.getSubjectListWithTeacher(req.params.classroomId);
  sendSuccessResponse(res, { message: 'Subjects fetched successfully', data: subjects });
});

const getClassroomListForTeacher = catchAsync(async (req, res) => {
  const classrooms = await classroomService.getClassroomListForTeacher(req.params.teacherId);
  sendSuccessResponse(res, { message: 'Classrooms fetched successfully', data: classrooms });
});

export const classroomController = {
  createClassroom,
  assignSubjectTeacher,
  removeSubjectTeacher,
  getSubjectListWithTeacher,
  getClassroomListForTeacher,
};
