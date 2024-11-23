import { Router } from 'express';
import { USER_ROLES } from '../../utils/types';
import { validationHandler } from '../../middlewares/validationHandler';
import { classroomValidation } from './classroom.validation';
import { authGuard } from '../../middlewares/authGuard';
import { classroomController } from './classroom.controller';

export const classroomRouter = Router();

classroomRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(classroomValidation.createClassroom),
  classroomController.createClassroom,
);
