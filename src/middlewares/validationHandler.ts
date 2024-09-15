import { AnyZodObject } from 'zod';
import { catchAsync } from './catchAsync';

export const validationHandler = (schema: AnyZodObject) => {
  return catchAsync(async (req, _res, next) => {
    const body = await schema.parseAsync(req.body);
    req.body = body;
    next();
  });
};
