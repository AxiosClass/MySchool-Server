import { encryptPassword } from '../../helpers/encryptionHelper';
import { TAddStudentPayload, TIssueNfcCardPayload, TUpdateStudentPayload } from './student.validation';
import { prismaClient } from '../../app/prisma';
import { AppError } from '../../utils/appError';
import { TObject } from '../../utils/types';
import { getMeta, getPaginationInfo } from '../../helpers/common';
import { DueType, Prisma } from '@prisma/client';

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
      select: {
        id: true,
        classroom: { select: { class: { select: { id: true, admissionFee: true, monthlyFee: true } } } },
      },
    });

    const studentClassInfo = student.classroom.class;

    const today = new Date();
    const duesInput = [
      {
        classId: studentClassInfo.id,
        amount: studentClassInfo.admissionFee,
        type: DueType.ADMISSION_FEE,
        studentId: student.id,
        year: today.getFullYear(),
      },
      {
        classId: studentClassInfo.id,
        amount: studentClassInfo.monthlyFee,
        type: DueType.MONTHLY_FEE,
        studentId: student.id,
        year: today.getFullYear(),
        month: today.getMonth(),
      },
    ];

    // creating student's due amount
    await tClient.due.createMany({ data: duesInput });

    return 'Student added successfully';
  });

  return message;
};

const getStudents = async (query: TObject) => {
  const searchTerm = query.searchTerm;
  const classLevel = query.classLevel as string;

  const { page, limit, skip } = getPaginationInfo(query);

  const whereQuery: Prisma.StudentScalarWhereInput = {
    ...(searchTerm && {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { id: { contains: searchTerm, mode: 'insensitive' } },
      ],
    }),
    ...(classLevel && { class: classLevel }),
    isDeleted: false,
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

const updateStudent = async (payload: TUpdateStudentPayload, studentId: string) => {
  const student = await prismaClient.student.findUnique({ where: { id: studentId }, select: { id: true } });
  if (!student) throw new AppError('Student not found!', 404);

  await prismaClient.student.update({ where: { id: studentId }, data: payload });
  return 'Student updated successfully';
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
      classroom: { select: { id: true, name: true, class: { select: { name: true, level: true } } } },
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
    classroomId: classroom.id,
    classroomName: classroom.name,
    className: classroom.class.name,
    classLevel: classroom.class.level,
    totalPaid,
    totalDue,
    totalDiscount,
  };
};

const getStudentDetails = async (studentId: string) => {
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: { name: true, birthId: true, bloodGroup: true, dob: true, address: true, parents: true, guardian: true },
  });

  if (!student) throw new AppError('Student not found!', 404);

  return student;
};

const getStudentListForPayment = async () => {
  const students = await prismaClient.student.findMany({
    where: { isDeleted: false },
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

const deleteStudent = async (studentId: string) => {
  const student = await prismaClient.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      isDeleted: true,
      payments: { select: { amount: true } },
      dues: { select: { amount: true } },
      discounts: { select: { amount: true } },
    },
  });

  if (!student) throw new AppError('Student not found', 404);
  if (student.isDeleted) throw new AppError('Student has been already removed', 400);

  const paid = student.payments.reduce((acc, { amount }) => (acc += amount), 0);
  const due = student.dues.reduce((acc, { amount }) => (acc += amount), 0);
  const discount = student.discounts.reduce((acc, { amount }) => (acc += amount), 0);
  const totalDue = due - paid - discount;

  if (totalDue) throw new AppError(`Student has already ${totalDue} TK due`, 400);
  await prismaClient.student.update({ where: { id: studentId }, data: { isDeleted: true } });

  return 'Student removed successfully';
};

export const studentService = {
  addStudent,
  getStudents,
  updateStudent,
  issueNfcCard,
  getStudentInfo,
  getStudentDetails,
  getStudentListForPayment,
  getStudentClassInfo,
  deleteStudent,
};
