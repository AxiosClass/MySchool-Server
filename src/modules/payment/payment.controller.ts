import { sendSuccessResponse } from '../../helpers/responseHelper';
import { catchAsync } from '../../middlewares/catchAsync';
import { TObject } from '../../utils/types';
import { paymentService } from './payment.service';

const takePayment = catchAsync(async (req, res) => {
  const payment = await paymentService.takePayment(req.body);
  sendSuccessResponse(res, { status: 201, message: 'Payment was successful!', data: payment });
});

const getPayments = catchAsync(async (req, res) => {
  const { payments, meta } = await paymentService.getPayments(req.query as TObject);
  sendSuccessResponse(res, { message: 'Payments retrieved successfully', meta, data: payments });
});

const getPaymentSummary = catchAsync(async (req, res) => {
  const summary = await paymentService.getPaymentSummary(req.params.studentId);
  sendSuccessResponse(res, { message: 'Payment summary retrieved successfully', data: summary });
});

export const paymentController = { takePayment, getPayments, getPaymentSummary };
