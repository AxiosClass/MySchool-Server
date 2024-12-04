import type { Response } from 'express';
import { ISuccessResponse, IErrorResponse } from '../utils/types';

export const sendSuccessResponse = (res: Response, payload: ISuccessResponse) => {
  const { message, meta, data, status = 200 } = payload;
  return res.status(status).json({ ok: true, message, meta, data });
};

export const sendErrorResponse = (res: Response, payload: IErrorResponse) => {
  const { status, message, error } = payload;
  return res.status(status).json({ ok: false, message, error });
};
