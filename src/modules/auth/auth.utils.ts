import { prismaClient } from '../../app/prisma';
import { USER_ROLES } from '../../utils/types';

const adminRoles = [USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN];

const getPassword = async (userRole: USER_ROLES, userId: string) => {
  if (adminRoles.includes(userRole)) {
    const user = await prismaClient.admin.findUnique({ where: { id: userId }, select: { password: true } });
    return user?.password;
  } else if (userRole === USER_ROLES.TEACHER) {
    const user = await prismaClient.teacher.findUnique({ where: { id: userId }, select: { password: true } });
    return user?.password;
  } else if (userRole === USER_ROLES.STUDENT) {
    const user = await prismaClient.student.findUnique({ where: { id: userId }, select: { password: true } });
    return user?.password;
  }
};

const updatePassword = async (userRole: USER_ROLES, userId: string, password: string) => {
  if (adminRoles.includes(userRole)) return prismaClient.admin.update({ where: { id: userId }, data: { password } });
  else if (userRole === USER_ROLES.TEACHER)
    return prismaClient.teacher.update({ where: { id: userId }, data: { password } });
  else if (userRole === USER_ROLES.STUDENT)
    return prismaClient.student.update({ where: { id: userId }, data: { password } });
};

const getNidOrBirthId = async (userRole: USER_ROLES, userId: string) => {
  if (userRole === USER_ROLES.TEACHER) {
    const user = await prismaClient.teacher.findUnique({ where: { id: userId }, select: { nid: true } });
    return user?.nid;
  } else if (userRole === USER_ROLES.STUDENT) {
    const user = await prismaClient.student.findUnique({ where: { id: userId }, select: { birthId: true } });
    return user?.birthId;
  }
};

export const authUtils = { getPassword, updatePassword, getNidOrBirthId };
