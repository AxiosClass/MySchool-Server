import { ErrorRequestHandler } from 'express';
import { sendErrorResponse } from '../helpers/responseHelper';
import { NODE_ENV } from '../app/config';
import { Prisma } from '@prisma/client';

interface IZodIssue {
  code: string;
  expected: string;
  received: string;
  path: string[];
  message: string;
}

export const globalErrorHandler: ErrorRequestHandler = (error, _, res, __) => {
  let status: number = error.status || 500;
  let message: string = error.message || 'something went wrong';

  console.log(error);

  // handling error for zod
  if (error.name === 'ZodError') {
    message = error.issues
      .map((issue: IZodIssue) => {
        const { code, expected, received, path, message } = issue;
        let msg: string = '';
        if (code === 'invalid_type') msg = `In ${path[0]} expected "${expected}" received "${received}"`;
        else msg = issue.message;
        return msg;
      })
      .join(' | ');
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      const fields = (error.meta?.target as string[])?.join(', ') || 'Unknown field';
      message = `Duplicate entry: A record with the same ${fields} already exists.`;
      status = 409;
    }
  }

  const errorInfo = NODE_ENV === 'development' ? error : null;

  return sendErrorResponse(res, { status, message, error: errorInfo });
};
