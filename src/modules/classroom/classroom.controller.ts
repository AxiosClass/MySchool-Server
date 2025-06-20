import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { classroomService } from './classroom.service';

const createClassroom = catchAsync(async (req, res) => {
  const message = await classroomService.createClassroom(req.body);
  sendSuccessResponse(res, { message });
});

const updateClassroom = catchAsync(async (req, res) => {
  const message = await classroomService.updateClassroom(req.body, req.params.classroomId);
  sendSuccessResponse(res, { message });
});

const assignSubjectTeacher = catchAsync(async (req, res) => {
  const message = await classroomService.assignSubjectTeacher(req.body);
  sendSuccessResponse(res, { message });
});

const removeSubjectTeacher = catchAsync(async (req, res) => {
  const message = await classroomService.removeSubjectTeacher(req.params.classroomSubjectTeacherId);
  sendSuccessResponse(res, { message });
});

const getClassroomListForTeacher = catchAsync(async (req, res) => {
  const classrooms = await classroomService.getClassroomListForTeacher(req.user.id);
  sendSuccessResponse(res, { message: 'Classrooms fetched successfully', data: classrooms });
});

const getStudentList = catchAsync(async (req, res) => {
  const students = await classroomService.getStudentList(req.params.classroomId);
  sendSuccessResponse(res, { message: 'Students fetched successfully', data: students });
});

const getClassroomDetailsById = catchAsync(async (req, res) => {
  const classroomDetails = await classroomService.getClassroomDetailsById(req.params.classroomId);
  sendSuccessResponse(res, { message: 'Classroom Details', data: classroomDetails });
});

const getSubjectListForClassroom = catchAsync(async (req, res) => {
  const subjects = await classroomService.getSubjectListForClassroom(req.params.classroomId);
  sendSuccessResponse(res, { message: 'Subject retrieved successfully', data: subjects });
});

const addNote = catchAsync(async (req, res) => {
  const message = await classroomService.addNote(req.body, req.user.id);
  sendSuccessResponse(res, { message });
});

const getNotes = catchAsync(async (req, res) => {
  const notes = await classroomService.getNotes(req.params.classroomId, req.query as TObject);
  sendSuccessResponse(res, { message: 'Notes retrieved successfully', data: notes });
});

const updateNote = catchAsync(async (req, res) => {
  const message = await classroomService.updateNote(req.params.noteId, req.body);
  sendSuccessResponse(res, { message });
});

const deleteNote = catchAsync(async (req, res) => {
  const message = await classroomService.deleteNote(req.params.noteId);
  sendSuccessResponse(res, { message });
});

const getTeachersSubjectsForClassroom = catchAsync(async (req, res) => {
  const subjects = await classroomService.getTeachersSubjectsForClassroom(req.params.classroomId, req.user.id);
  sendSuccessResponse(res, { message: 'Subjects retrieved successfully', data: subjects });
});

export const classroomController = {
  createClassroom,
  updateClassroom,
  assignSubjectTeacher,
  removeSubjectTeacher,
  getClassroomListForTeacher,
  getStudentList,
  getClassroomDetailsById,
  getSubjectListForClassroom,
  addNote,
  getNotes,
  updateNote,
  deleteNote,
  getTeachersSubjectsForClassroom,
};
