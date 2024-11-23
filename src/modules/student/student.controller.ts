import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { studentService } from './student.service';

const addStudent = catchAsync(async (req, res) => {
  const { id, password } = await studentService.addStudent(req.body);

  return sendSuccessResponse(res, {
    status: 201,
    message: 'Student added successfully',
    data: { id, password },
  });
});

export const studentController = { addStudent };
