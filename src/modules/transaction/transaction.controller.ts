import * as services from './services';

import { sendSuccessResponse } from '../../helpers';
import { catchAsync } from '../../middlewares';

export const addPayment = catchAsync(async (req, res) => {
  const payment = await services.addPayment(req.body);

  return sendSuccessResponse(res, {
    message: 'Payment Added successfully',
    data: payment,
  });
});

export const giveSalary = catchAsync(async (req, res) => {
  const transaction = await services.giveSalary(req.body);

  return sendSuccessResponse(res, {
    message: 'Salary is given',
    data: transaction,
  });
});
