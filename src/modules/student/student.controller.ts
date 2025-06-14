import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { studentService } from './student.service';

const addStudent = catchAsync(async (req, res) => {
  const message = await studentService.addStudent(req.body);
  sendSuccessResponse(res, { status: 201, message });
});

const getStudents = catchAsync(async (_, res) => {
  const { student } = await studentService.getStudents();
  sendSuccessResponse(res, { message: 'Student retrieved successfully', data: student });
});

const issueNfcCard = catchAsync(async (req, res) => {
  const message = await studentService.issueNfcCard(req.body);
  sendSuccessResponse(res, { message });
});

const getStudentInfo = catchAsync(async (req, res) => {
  const result = await studentService.getStudentInfo(req.params.studentId);
  sendSuccessResponse(res, { message: 'Student Info Fetched Successfully', data: result });
});

const getStudentListForPayment = catchAsync(async (req, res) => {
  const students = await studentService.getStudentListForPayment();
  sendSuccessResponse(res, { message: 'Student list retrieved successfully', data: students });
});

export const studentController = { addStudent, getStudents, issueNfcCard, getStudentInfo, getStudentListForPayment };
