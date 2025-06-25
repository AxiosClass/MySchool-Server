import { prismaClient } from '../app/prisma';
import { verifyAccessToken } from '../helpers/tokenHelper';
import { USER_ROLES } from '../utils/types';
import { catchAsync } from './catchAsync';
import { UserStatus } from '@prisma/client';
import { AppError } from '../utils/appError';

const BEARER = 'bearer';
const ADMIN_ROLES = [USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT, USER_ROLES.SUPER_ADMIN];

export const authGuard = (...requiredRoles: USER_ROLES[]) => {
  return catchAsync(async (req, _, next) => {
    const token = req.headers.authorization;
    if (!token) throw new AppError('No token found', 404);

    const [bearer, authToken] = token.split(' ');
    if (BEARER !== bearer.toLowerCase()) throw new AppError('Invalid token formate', 400);

    // verifying the token
    const decodedUser = verifyAccessToken(authToken);
    if (!decodedUser) throw new AppError('Invalid token', 400);

    const { id, role } = decodedUser;
    if (!requiredRoles.includes(role)) throw new AppError('Un authorized access', 401);

    const isAdmin = ADMIN_ROLES.includes(role);
    const isTeacher = role === USER_ROLES.TEACHER;
    const isStudent = role === USER_ROLES.STUDENT;

    if (isAdmin) {
      const adminInfo = await prismaClient.admin.findUnique({
        where: { id },
        select: { name: true, role: true, status: true, needPasswordChange: true },
      });

      if (!adminInfo) throw new AppError('User not found!', 404);

      if (adminInfo.status === UserStatus.BLOCKED)
        throw new AppError('You are blocked, please contact to the admin', 400);

      if (!requiredRoles.includes(adminInfo.role as USER_ROLES)) throw new AppError('Un authorized access', 401);

      const { name, role, needPasswordChange } = adminInfo;
      req.user = { id, name, role: role as USER_ROLES, needPasswordChange };
    }
    // Teacher
    else if (isTeacher) {
      const teacherInfo = await prismaClient.teacher.findUnique({
        where: { id },
        select: { name: true, status: true, needPasswordChange: true },
      });

      if (!teacherInfo) throw new AppError('User not found', 404);

      if (teacherInfo.status === UserStatus.BLOCKED)
        throw new AppError('You are blocked, please contact to the admin', 400);

      const { name, needPasswordChange } = teacherInfo;
      req.user = { id, name, role: USER_ROLES.TEACHER, needPasswordChange };
    }
    // student
    else if (isStudent) {
      const studentInfo = await prismaClient.student.findUnique({
        where: { id },
        select: { name: true, status: true, needPasswordChange: true, isDeleted: true },
      });

      if (!studentInfo) throw new AppError('User not found!', 404);

      const { name, needPasswordChange } = studentInfo;

      if (studentInfo.status === UserStatus.BLOCKED)
        throw new AppError('You are blocked, please contact to the admin', 400);
      if (studentInfo.isDeleted) throw new AppError('You have been removed', 400);

      req.user = { id, name, role: USER_ROLES.STUDENT, needPasswordChange };
    }

    next();
  });
};
