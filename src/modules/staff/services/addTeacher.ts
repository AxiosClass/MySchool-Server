import { TAddTeacherPayload } from '../validation';
import { encryptPassword } from '../../../helpers';
import { prismaClient } from '../../../app/prisma';
import { AppError } from '../../../utils';

export const addTeacher = async (payload: TAddTeacherPayload) => {
  const {
    userId,
    name,
    nid,
    dob,
    bloodGroup,
    salary,
    designation,
    address,
    education,
  } = payload;

  // checking if teacher exist or not
  const isUserExist = await prismaClient.user.findUnique({
    where: { userId },
  });

  if (isUserExist)
    throw new AppError(
      `Teacher Code : ${payload.userId} already exist try another one`,
      400,
    );

  const password = await encryptPassword(nid);

  const teacher = await prismaClient.$transaction(async (transactionClient) => {
    const user = await transactionClient.user.create({
      data: { userId, name, role: 'TEACHER', password },
    });

    if (!user) throw new AppError('Failed to add teacher', 400);

    const teacher = await transactionClient.staff.create({
      data: {
        userId,
        name,
        nid,
        dob,
        bloodGroup,
        salary,
        designation,
        address,
        education,
        role: 'TEACHER',
      },
    });

    if (!teacher) throw new AppError('Failed to add teacher', 400);

    return teacher;
  });

  return teacher;
};
