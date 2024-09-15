import { NODE_ENV } from '../app/config';
import { ErrorRequestHandler } from 'express';
import { sendErrorResponse } from '../helpers';

export const globalErrorHandler: ErrorRequestHandler = (error, _, res, __) => {
  let status: number = error.status || 500;
  let message: string = error.message || 'something went wrong';

  // handling error for zod
  if (error.name === 'ZodError') {
    message = error.issues.reduce(
      (
        msg: string,
        issue: { message: string; path: any[]; received: string },
        index: number,
      ) => {
        msg +=
          issue.received === 'undefined'
            ? issue.message
            : `In ${issue.path[0]} ${issue.message}`;
        msg += index !== error.issues.length - 1 ? ' || ' : '';
        return msg;
      },
      '',
    );
  }

  // handling error for mongoose
  // duplicate key
  if (error.errorResponse?.code === 11000) {
    const { errorResponse } = error;
    const [key] = Object.keys(errorResponse.keyPattern);
    message = `${key} : ${errorResponse.keyValue[key]} already exist`;
    status = 400;
  }

  const errorInfo = NODE_ENV === 'development' ? error : null;

  return sendErrorResponse(res, { status, message, error: errorInfo });
};
