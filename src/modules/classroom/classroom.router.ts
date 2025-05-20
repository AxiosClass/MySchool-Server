import { Router } from 'express';

import { validationHandler } from '../../middlewares/validationHandler';
import { classroomValidation } from './classroom.validation';
import { classroomController } from './classroom.controller';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';
import multer from 'multer';

const classroomRouter = Router();

classroomRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(classroomValidation.createClassroom),
  classroomController.createClassroom,
);

classroomRouter.post(
  '/subject-teacher',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(classroomValidation.assignSubjectTeacher),
  classroomController.assignSubjectTeacher,
);

classroomRouter.delete(
  '/subject-teacher/:classroomSubjectTeacherId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  classroomController.removeSubjectTeacher,
);

classroomRouter.get(
  '/:classroomId/students',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER),
  classroomController.getStudentList,
);

const classroomsRouter = Router();

classroomsRouter.get(
  '/teacher/:teacherId',
  authGuard(USER_ROLES.TEACHER),
  classroomController.getClassroomListForTeacher,
);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

classroomsRouter.post(
  '/upload-material',
  authGuard(USER_ROLES.TEACHER),
  upload.single('file'),
  classroomController.uploadMaterial,
);

classroomsRouter.get(
  '/materials/:classroomId',
  authGuard(USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classroomController.getMaterials,
);

classroomsRouter.delete('/materials/:materialId', authGuard(USER_ROLES.TEACHER), classroomController.deleteMaterial);

export { classroomRouter, classroomsRouter };
