import { catchAsync } from './catchAsync';
import { AnyZodObject } from 'zod';

export const validationHandler = (schema: AnyZodObject) => {
  return catchAsync(async (req, _res, next) => {
    const body = await schema.parseAsync(req.body);
    req.body = body;
    next();
  });
};
