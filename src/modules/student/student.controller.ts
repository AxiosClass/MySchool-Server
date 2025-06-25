import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { studentService } from './student.service';

const addStudent = catchAsync(async (req, res) => {
  const message = await studentService.addStudent(req.body);
  sendSuccessResponse(res, { status: 201, message });
});

const updateStudent = catchAsync(async (req, res) => {
  const message = await studentService.updateStudent(req.body, req.params.studentId);
  sendSuccessResponse(res, { status: 201, message });
});

const getStudents = catchAsync(async (req, res) => {
  const { students, meta } = await studentService.getStudents(req.query as TObject);
  sendSuccessResponse(res, { message: 'Student retrieved successfully', meta, data: students });
});

const issueNfcCard = catchAsync(async (req, res) => {
  const message = await studentService.issueNfcCard(req.body);
  sendSuccessResponse(res, { message });
});

const getStudentInfo = catchAsync(async (req, res) => {
  const result = await studentService.getStudentInfo(req.params.studentId);
  sendSuccessResponse(res, { message: 'Student Info Fetched Successfully', data: result });
});

const getStudentDetails = catchAsync(async (req, res) => {
  const student = await studentService.getStudentDetails(req.params.studentId);
  sendSuccessResponse(res, { message: 'Student details fetched successfully', data: student });
});

const getStudentListForPayment = catchAsync(async (req, res) => {
  const students = await studentService.getStudentListForPayment();
  sendSuccessResponse(res, { message: 'Student list retrieved successfully', data: students });
});

const getStudentClassInfo = catchAsync(async (req, res) => {
  const classInfo = await studentService.getStudentClassInfo(req.params.studentId);
  sendSuccessResponse(res, { message: 'Class info retrieved successfully', data: classInfo });
});

const deleteStudent = catchAsync(async (req, res) => {
  const message = await studentService.deleteStudent(req.params.studentId);
  sendSuccessResponse(res, { message });
});

export const studentController = {
  addStudent,
  updateStudent,
  getStudents,
  issueNfcCard,
  getStudentInfo,
  getStudentDetails,
  getStudentListForPayment,
  getStudentClassInfo,
  deleteStudent,
};
