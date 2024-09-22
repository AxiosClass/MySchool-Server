import { encryptPassword } from '../../../helpers';
import { prismaClient } from '../../../app/prisma';
import { AppError } from '../../../utils';

type addStudentType = {
  name: string;
  birthId: string;
  class: string;
  classId: string;
  dob: string;
  bloodGroup: string;
  parents: Record<string, any>;
  guardian: Record<string, any>;
  address: Record<string, any>;
  admittedByUserId: string;
};

export const addStudent = async (payload: addStudentType) => {
  const {
    name,
    dob,
    bloodGroup,
    address,
    classId,
    class: studentClass,
  } = payload;

  const dobAsDate = new Date(dob);

  const currentYear = new Date().getFullYear();

  const existingClass = await prismaClient.section.findUnique({
    where: { id: classId },
  });

  if (!existingClass) {
    throw new AppError('Class does not exist', 400);
  }

  let lastStudent = await prismaClient.student.findFirst({
    where: {
      class: studentClass,
    },
    orderBy: {
      userId: 'desc',
    },
  });

  let newUserId: string;

  if (!lastStudent) {
    newUserId = `${currentYear}${studentClass}001`;
  } else {
    const lastUserIdNumber = parseInt(lastStudent.userId.slice(-3));
    const newUserIdNumber = lastUserIdNumber + 1;
    newUserId = `${currentYear}${studentClass}${String(newUserIdNumber).padStart(3, '0')}`;
  }

  const password = await encryptPassword(payload.birthId);

  const student = await prismaClient.$transaction(async (transactionClient) => {
    const newStudent = await transactionClient.student.create({
      data: {
        ...payload,
        dob: dobAsDate,
        userId: newUserId,
        admittedByUserId: payload.admittedByUserId,
      },
    });

    if (!newStudent) throw new AppError('Failed to add student', 400);

    const user = await transactionClient.user.create({
      data: { userId: newUserId, name, role: 'STUDENT', password },
    });
    if (!user) throw new AppError('Failed to add student', 400);

    return newStudent;
  });

  return student;
};
