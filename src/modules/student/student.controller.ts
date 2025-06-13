import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { studentService } from './student.service';

const addStudent = catchAsync(async (req, res) => {
  const { id, password } = await studentService.addStudent(req.body);
  sendSuccessResponse(res, { status: 201, message: 'Student added successfully', data: { id, password } });
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

export const studentController = { addStudent, getStudents, issueNfcCard, getStudentInfo };
