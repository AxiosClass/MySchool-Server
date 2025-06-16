import { encryptPassword } from '../../helpers/encryptionHelper';
import { TAddStudentPayload, TIssueNfcCardPayload } from './student.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { getMeta, getPaginationInfo } from '../../helpers/common';
import { Prisma, PrismaClient } from '@prisma/client';

const addStudent = async (payload: TAddStudentPayload) => {
  // getting last student's id
  const classInfo = await prismaClient.classroom.findUnique({
    where: { id: payload.classroomId },
    select: { class: { select: { level: true } } },
  });

  if (!classInfo) throw new AppError('Invalid classroom id', 400);

  const lastStudent = await prismaClient.student.findFirst({
    where: { class: classInfo.class.level },
    orderBy: { admittedAt: 'desc' },
  });

  const date = new Date();
  // generating student's id
  let studentId; // formate of student id => year - class - id_part
  if (!lastStudent) {
    studentId = `${date.getFullYear()}-${classInfo.class.level}-001`;
  } else {
    const [yearPart, classPart, idPart] = lastStudent.id.split('-');
    const idPartAsNumber = Number(idPart) + 1;
    studentId = `${yearPart}-${classPart}-${idPartAsNumber.toString().padStart(3, '0')}`;
  }

  const hashedPassword = await encryptPassword(payload.birthId);

  const message = await prismaClient.$transaction(async (tClient) => {
    // creating student
    const student = await tClient.student.create({
      data: { ...payload, id: studentId, password: hashedPassword, class: classInfo.class.level },
      select: { id: true, classroom: { select: { class: { select: { id: true, admissionFee: true } } } } },
    });

    const studentClassInfo = student.classroom.class;

    // creating student's due amount
    await tClient.due.create({
      data: {
        classId: studentClassInfo.id,
        amount: studentClassInfo.admissionFee,
        type: 'ADMISSION_FEE',
        studentId: student.id,
        year: new Date().getFullYear(),
      },
    });

    return 'Student added successfully';
  });

  return message;
};

const getStudents = async (query: TObject) => {
  const searchTerm = query.searchTerm;
  console.log({ searchTerm });
  const { page, limit, skip } = getPaginationInfo(query);

  const whereQuery: Prisma.StudentScalarWhereInput = {
    ...(searchTerm && {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { id: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }),
  };

  const student = await prismaClient.student.findMany({
    where: whereQuery,
    select: {
      id: true,
      name: true,
      address: true,
      guardian: true,
      admittedAt: true,
      class: true,
      classroom: { select: { name: true } },
      cardId: true,
    },
    orderBy: { name: 'asc' },
    skip,
    take: limit,
  });

  const totalStudentCount = await prismaClient.student.count({ where: whereQuery });

  const formattedStudents = student.map((student) => {
    const { classroom, ...rest } = student;
    return { ...rest, classroomName: classroom.name };
  });

  const meta = getMeta({ page, limit, total: totalStudentCount });

  return { students: formattedStudents, meta };
};

const issueNfcCard = async (payload: TIssueNfcCardPayload) => {
  const isCardIssued = await prismaClient.student.findFirst({
    where: { cardId: payload.cardId },
    select: { id: true },
  });

  if (isCardIssued?.id) throw new AppError('This card has already been issued', 400);
  await prismaClient.student.update({ where: { id: payload.id }, data: { cardId: payload.cardId } });

  return 'Card has been issued';
};

const getStudentInfo = async (studentId: string) => {
  const studentInfo = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      name: true,
      classroom: { select: { name: true, class: { select: { name: true, level: true } } } },
      admittedAt: true,
      status: true,
      dues: { select: { amount: true } },
      payments: { select: { amount: true } },
      discounts: { select: { amount: true } },
    },
  });

  if (!studentInfo) throw new AppError('Student not found', 404);
  const { classroom, ...rest } = studentInfo;

  const totalDue = studentInfo.dues.reduce((acc, due) => (acc += due.amount), 0);
  const totalPaid = studentInfo.payments.reduce((acc, payment) => (acc += payment.amount), 0);
  const totalDiscount = studentInfo.discounts.reduce((acc, discount) => (acc += discount.amount), 0);

  return {
    ...rest,
    classroomName: classroom.name,
    className: classroom.class.name,
    classLevel: classroom.class.level,
    totalPaid,
    totalDue,
    totalDiscount,
  };
};

const getStudentListForPayment = async () => {
  const students = await prismaClient.student.findMany({
    select: {
      id: true,
      name: true,
      classroom: { select: { name: true, class: { select: { name: true, level: true } } } },
    },
  });

  return students.map((student) => {
    const { classroom, ...rest } = student;

    return {
      ...rest,
      classroomName: classroom.name,
      className: classroom.class.name,
      classLevel: classroom.class.level,
    };
  });
};

const getStudentClassInfo = async (studentId: string) => {
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: {
      classroom: {
        select: {
          class: { select: { id: true, name: true, level: true, monthlyFee: true, admissionFee: true, termFee: true } },
        },
      },
    },
  });

  if (!student) throw new AppError('Student does not exist', 404);

  return student.classroom.class;
};

export const studentService = {
  addStudent,
  getStudents,
  issueNfcCard,
  getStudentInfo,
  getStudentListForPayment,
  getStudentClassInfo,
};
