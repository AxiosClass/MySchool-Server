import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { paymentService } from './payment.service';

const takePayment = catchAsync(async (req, res) => {
  const payment = await paymentService.takePayment(req.body);
  sendSuccessResponse(res, { status: 201, message: 'Payment was successful!', data: payment });
});

const getPaymentSummary = catchAsync(async (req, res) => {
  const summary = await paymentService.getPaymentSummary(req.params.studentId);
  sendSuccessResponse(res, { message: 'Payment summary retrieved successfully', data: summary });
});

export const paymentController = { takePayment, getPaymentSummary };
