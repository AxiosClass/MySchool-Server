import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { classroomService } from './classroom.service';
import { Request, Response } from 'express';
import { classroomValidation } from './classroom.validation';

const createClassroom = catchAsync(async (req, res) => {
  const message = await classroomService.createClassroom(req.body);
  sendSuccessResponse(res, { status: 201, message });
});

const assignSubjectTeacher = catchAsync(async (req, res) => {
  const message = await classroomService.assignSubjectTeacher(req.body);
  sendSuccessResponse(res, { status: 201, message });
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

const uploadMaterial = catchAsync(async (req: Request, res: Response) => {
  const file = req.file;

  console.log(req);
  if (!file) {
    throw new Error('No file uploaded');
  }

  const payload = await classroomValidation.uploadMaterialValidation.parseAsync(req.body);
  const result = await classroomService.uploadMaterial(file, payload);

  res.status(200).json({
    success: true,
    message: 'Material uploaded successfully',
    data: result,
  });
});

const getMaterials = catchAsync(async (req: Request, res: Response) => {
  const { classroomId } = req.params;
  const result = await classroomService.getMaterials(classroomId);

  res.status(200).json({
    success: true,
    message: 'Materials retrieved successfully',
    data: result,
  });
});

const deleteMaterial = catchAsync(async (req: Request, res: Response) => {
  const { materialId } = req.params;
  const result = await classroomService.deleteMaterial(materialId);

  res.status(200).json({
    success: true,
    message: result,
  });
});

export const classroomController = {
  createClassroom,
  assignSubjectTeacher,
  removeSubjectTeacher,
  getClassroomListForTeacher,
  getStudentList,
  uploadMaterial,
  getMaterials,
  deleteMaterial,
};
