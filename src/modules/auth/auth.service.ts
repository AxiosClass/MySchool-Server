import { UserStatus } from '@prisma/client';
import { TLoginPayload } from './auth.validation';
import { AppError } from '../../utils/appError';
import { prismaClient } from '../../app/prisma';
import { IUserInfo, USER_ROLES } from '../../utils/types';
import { comparePassword } from '../../helpers/encryptionHelper';
import { generateAccessToken } from '../../helpers/tokenHelper';

const loginTypes = ['ADMIN', 'TEACHER', 'STUDENT'];

const login = async (payload: TLoginPayload, type: string) => {
  let refinedLoginType: string = '';

  for (const eachType of loginTypes) {
    if (eachType === type.toUpperCase()) {
      refinedLoginType = eachType;
      break;
    }
  }

  if (!refinedLoginType) throw new AppError('Invalid type selection, Type has to be ADMIN | TEACHER | STUDENT', 400);
  let tokenPayload: IUserInfo | null = null;

  switch (refinedLoginType) {
    case 'ADMIN': {
      const adminInfo = await prismaClient.admin.findUnique({
        where: { id: payload.id },
        select: { id: true, name: true, password: true, role: true, status: true, needPasswordChange: true },
      });

      if (!adminInfo) throw new AppError('Admin not found', 404);

      if (adminInfo.status === UserStatus.BLOCKED) throw new AppError('You are blocked please contact to admin', 400);

      // checking password
      const isPasswordMatched = await comparePassword(payload.password, adminInfo.password);

      if (!isPasswordMatched) throw new AppError('Password does not match', 400);

      // generating token payload
      tokenPayload = {
        id: adminInfo.id,
        name: adminInfo.name,
        role: adminInfo.role as USER_ROLES,
        needPasswordChange: adminInfo.needPasswordChange,
      };

      break;
    }

    case 'TEACHER': {
      const teacherInfo = await prismaClient.teacher.findUnique({
        where: { id: payload.id },
        select: { id: true, name: true, password: true, status: true },
      });

      if (!teacherInfo) throw new AppError('Teacher not found', 404);
      if (teacherInfo.status === UserStatus.BLOCKED) throw new AppError('You are blocked please contact to admin', 400);

      const isPasswordMatched = await comparePassword(payload.password, teacherInfo.password);
      if (!isPasswordMatched) throw new AppError('Password does not match', 400);

      tokenPayload = {
        id: teacherInfo.id,
        name: teacherInfo.name,
        role: USER_ROLES.TEACHER,
        needPasswordChange: false,
      };

      break;
    }

    case 'STUDENT': {
      const studentInfo = await prismaClient.student.findUnique({
        where: { id: payload.id },
        select: { id: true, name: true, needPasswordChange: true },
      });

      if (!studentInfo) throw new AppError('Student not found', 404);

      const { id, name, needPasswordChange } = studentInfo;
      tokenPayload = { id, name, needPasswordChange, role: USER_ROLES.STUDENT };

      break;
    }
  }

  const accessToken = generateAccessToken(tokenPayload);
  return { accessToken };
};

export const authService = { login };
