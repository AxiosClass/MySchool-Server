import { Router } from 'express';

import { validationHandler } from '../../middlewares/validationHandler';
import { classroomValidation } from './classroom.validation';
import { classroomController } from './classroom.controller';
import { authGuard } from '../../middlewares/authGuard';
import { USER_ROLES } from '../../utils/types';

const classroomRouter = Router();

classroomRouter.post(
  '/',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(classroomValidation.createClassroomSchema),
  classroomController.createClassroom,
);

classroomRouter.post(
  '/subject-teacher',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  validationHandler(classroomValidation.assignSubjectTeacherSchema),
  classroomController.assignSubjectTeacher,
);

classroomRouter.delete(
  '/subject-teacher/:classroomSubjectTeacherId',
  authGuard(USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN),
  classroomController.removeSubjectTeacher,
);

classroomRouter.get(
  '/:classroomId',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT),
  classroomController.getClassroomDetailsById,
);

classroomRouter.get(
  '/:classroomId/students',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN, USER_ROLES.TEACHER),
  classroomController.getStudentList,
);

classroomRouter.get(
  '/:classroomId/subjects',
  authGuard(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  classroomController.getSubjectListForClassroom,
);

classroomRouter.post(
  '/note',
  authGuard(USER_ROLES.TEACHER),
  validationHandler(classroomValidation.addNoteSchema),
  classroomController.addNote,
);

classroomRouter.patch(
  '/note/:noteId',
  authGuard(USER_ROLES.TEACHER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  validationHandler(classroomValidation.updateNoteSchema),
  classroomController.updateNote,
);

classroomRouter.delete(
  '/note/:noteId',
  authGuard(USER_ROLES.TEACHER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  classroomController.deleteNote,
);

classroomRouter.get(
  '/:classroomId/notes',
  authGuard(USER_ROLES.TEACHER, USER_ROLES.STUDENT, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
  classroomController.getNotes,
);

const classroomsRouter = Router();

classroomsRouter.get(
  '/teacher/:teacherId',
  authGuard(USER_ROLES.TEACHER),
  classroomController.getClassroomListForTeacher,
);

export { classroomRouter, classroomsRouter };
