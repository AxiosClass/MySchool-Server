import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { subjectService } from './subject.service';

const createSubject = catchAsync(async (req, res) => {
  const message = await subjectService.createSubject(req.body);
  sendSuccessResponse(res, { message });
});

const getSubjects = catchAsync(async (req, res) => {
  const subjects = await subjectService.getSubjects(req.query as TObject);
  sendSuccessResponse(res, { message: 'Subjects fetched successfully', data: subjects });
});

const updateSubject = catchAsync(async (req, res) => {
  const message = await subjectService.updateSubject(req.body, req.params.subjectId);
  sendSuccessResponse(res, { message });
});

const deleteSubject = catchAsync(async (req, res) => {
  const message = await subjectService.deleteSubject(req.params.subjectId);
  sendSuccessResponse(res, { message });
});

const assignSubjects = catchAsync(async (req, res) => {
  const message = await subjectService.assignSubjects(req.body, req.params.classId);
  sendSuccessResponse(res, { message });
});

export const subjectController = { createSubject, getSubjects, updateSubject, deleteSubject, assignSubjects };
